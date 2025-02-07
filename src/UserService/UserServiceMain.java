package UserService;

import com.sun.net.httpserver.HttpServer;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpExchange;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.util.concurrent.ConcurrentHashMap;
import java.util.Map;
import java.util.concurrent.Executors;

public class UserServiceMain {
    private static final Map<Integer, User> users = new ConcurrentHashMap<>();

    public static void main(String[] args) throws IOException {
        int port = 15001;
        HttpServer server = HttpServer.create(new InetSocketAddress(port), 0);
        server.setExecutor(Executors.newFixedThreadPool(20));
        server.createContext("/user", new UserHandler());
        server.start();
        System.out.println("UserService started on port " + port);
    }

    static class UserHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            String method = exchange.getRequestMethod();
            String path = exchange.getRequestURI().getPath();
            System.out.println("Request Method: " + method);
            System.out.println("Request Path: " + path);

            if ("POST".equalsIgnoreCase(method)) {
                handlePostRequest(exchange);
            } else if ("GET".equalsIgnoreCase(method)) {
                handleGetRequest(exchange);
            } else {
                sendResponse(exchange, "Invalid HTTP method.", 405);
            }
        }

        private void handlePostRequest(HttpExchange exchange) throws IOException {
            String requestBody = getRequestBody(exchange);
            Map<String, String> requestData = parseFormData(requestBody);
            
            String command = requestData.get("command");
            int id;
            try {
                id = Integer.parseInt(requestData.get("id"));
            } catch (NumberFormatException e) {
                sendResponse(exchange, "Invalid user ID format.", 400);
                return;
            }

            String name;
            String description;
            String email; 
            String password; 
            int authorization;         
            String response;

            switch (command) {
                case "create":
                    if (users.containsKey(id)) {
                        sendResponse(exchange, "User ID already exists.", 409);
                        return;
                    }

                    name = requestData.get("name");
                    if (name.trim().isEmpty()) {
                        sendResponse(exchange, "Your name cannot be empty.", 400);
                        return;
                    }

                    description = requestData.get("description");
                    if (description == null || !description.matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$")) {
                        sendResponse(exchange, "Invalid description format.", 400);
                        return;
                    }

                    email = requestData.get("email");
                    if (email == null || !email.matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$")) {
                        sendResponse(exchange, "Invalid email format.", 400);
                        return;
                    }

                    password = requestData.get("password");
                    if (password == null || password.trim().isEmpty()) {
                        sendResponse(exchange, "Password cannot be empty.", 400);
                        return;
                    }

                    try {
                        authorization = Integer.parseInt(requestData.get("authorization"));
                    } catch (NumberFormatException e) {
                        sendResponse(exchange, "Invalid user Authorization format.", 400);
                        return;
                    }

                    User user = new User(id, name, description, email, password, new String[]{}, new String[]{}, authorization);
                    users.put(id, user);
                    response = "User created successfully.";
                    break;
                case "delete":
                    User existingUser = users.get(id);
                    if (existingUser != null) {

                        name = requestData.get("name");
                        if (name == null) {
                            sendResponse(exchange, "Username cannot be empty.", 400);
                            return;
                        }

                        email = requestData.get("email");
                        if (email == null || !email.matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$")) {
                            sendResponse(exchange, "Invalid email format or not passed.", 400);
                            return;
                        }

                        password = requestData.get("password");
                        if (password == null) {
                            sendResponse(exchange, "Password not passed", 400);
                            return;
                        }

                        try {
                            authorization = Integer.parseInt(requestData.get("authorization"));
                        } catch (NumberFormatException e) {
                            sendResponse(exchange, "Invalid user Authorization format.", 400);
                            return;
                        }

                        User u = new User(id, name, "", email, password, new String[]{}, new String[]{}, authorization);
                        if (existingUser.equals(u)) {
                            users.remove(id);
                            response = "User deleted successfully.";
                        } else {
                            sendResponse(exchange, "fields don't match, user not found.", 401);
                            return;
                        }


                    } else {
                        sendResponse(exchange, "User not found.", 404);
                        return;
                    }
                    break;
                default:
                    response = "Invalid command.";
            }
            sendResponse(exchange, response, 200);
        }

        private void handleGetRequest(HttpExchange exchange) throws IOException {
            String path = exchange.getRequestURI().getPath();
            String[] segments = path.split("/");
            if (segments.length == 3) {
                try {
                    int id = Integer.parseInt(segments[2]);
                    User user = users.get(id);
                    if (user != null) {
                        sendResponse(exchange, user.toString(), 200);
                    } else {
                        sendResponse(exchange, "User not found.", 404);
                    }
                } catch (NumberFormatException e) {
                    sendResponse(exchange, "Invalid user ID.", 400);
                }
            } else {
                sendResponse(exchange, "Invalid URL.", 400);
            }
        }

        private String getRequestBody(HttpExchange exchange) throws IOException {
            try (BufferedReader br = new BufferedReader(new InputStreamReader(exchange.getRequestBody(), StandardCharsets.UTF_8))) {
                StringBuilder requestBody = new StringBuilder();
                String line;
                while ((line = br.readLine()) != null) {
                    requestBody.append(line);
                }
                return requestBody.toString();
            }
        }

        private Map<String, String> parseFormData(String data) {
            Map<String, String> result = new ConcurrentHashMap<>();
            String[] pairs = data.split("&");
            for (String pair : pairs) {
                String[] keyValue = pair.split("=");
                if (keyValue.length == 2) {
                    result.put(keyValue[0], keyValue[1]);
                }
            }
            return result;
        }

        private void sendResponse(HttpExchange exchange, String response, int statusCode) throws IOException {
            exchange.sendResponseHeaders(statusCode, response.getBytes(StandardCharsets.UTF_8).length);
            try (OutputStream os = exchange.getResponseBody()) {
                os.write(response.getBytes(StandardCharsets.UTF_8));
            }
        }
    }
}
