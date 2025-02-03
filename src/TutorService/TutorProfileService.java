package TutorService;

import com.sun.net.httpserver.HttpServer;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpExchange;
import java.io.IOException;
import java.io.OutputStream;
import java.io.FileReader;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;

import org.json.JSONObject;
import org.json.JSONTokener;


class TutorProfileService {
    public static void main(String[] args) throws IOException {
        
        // Read the config file
        JSONObject config = readJsonFile("config/config.json");
        
        if (config == null) {
            System.out.println("Failed to read config file");
            return;
        }

        // Get port and ip from config file
        int port = config.getJSONObject("TutorProfileService").getInt("port");
        String ipAddress = config.getJSONObject("TutorProfileService").getString("ip");

        HttpServer server = HttpServer.create(new InetSocketAddress(ipAddress, port), 0);

        // Set up context for /tutor request
        server.createContext("/tutor", new TutorHandler());

        // Creates a default executor
        server.setExecutor(null); 
        
        // Start the Server
        server.start();
        System.out.println("Server started on port " + port);
        System.out.println("IP Address: " + ipAddress);
        

    }

    /**
     * This class is a custom HttpHandler that handles requests for the /tutor endpoint.
     * It implements the HttpHandler interface and overrides the handle method to handle requests.
     * 
     */
    static class TutorHandler implements HttpHandler {

        /**
         * This method distributes the requests for the /tutor endpoint to each handler method
         * @param exchange - The HttpExchange object
         * @throws IOException
         */
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            
            if ("POST".equals(exchange.getRequestMethod())) {
                handlePost(exchange);

            } else if ("PATCH".equals(exchange.getRequestMethod())) {
                handlePatch(exchange);

            } else if ("GET".equals(exchange.getRequestMethod())) {
                handleGet(exchange);
        
            } else if ("DELETE".equals(exchange.getRequestMethod())) {
                handleDelete(exchange);

            } else {
                // Invalid request method
                sendJsonResponse(exchange, new JSONObject(), 405);
            }
        }

        public void handlePost(HttpExchange exchange) throws IOException {
            // TODO: creation of a tutor

            /** needs to have some or all of the following:
             *      - user_id
             *      - name
             *      - email
             *      - hashed_password
             *      - University
             *      - courses
             *      - profile_description
             *      - reviewsIdList - not going to be sent here since new tutor has no reviews
             *      
             */  
            
            sendJsonResponse(exchange, new JSONObject().put("message", "NOT IMPLEMENTED"), 200);
        }

        public void handleGet(HttpExchange exchange) throws IOException {
            /** needs to send back all of the following:
             *      - user_id
             *      - username
             *      - name
             *      - email
             *      - hashed_password
             *      - UniversityId
             *      - coursesIdList
             *      - profile_description
             *      - reviewsIdList - not going to be sent here since new tutor has no reviews
             *      
             */ 

            // Get the request URI
            String requestURI = exchange.getRequestURI().toString();

            // Get the id from the URI
            String[] uriParts = requestURI.split("/");

            // Error Response
            if (uriParts.length < 3) {
                sendJsonResponse(exchange, new JSONObject(), 400);
                return;
                
            }

             // Get the id
            int id;
            try {
                id = Integer.parseInt(uriParts[2]);
            } catch (NumberFormatException e) {

                // Incorrect field type, reponse
                sendJsonResponse(exchange, new JSONObject(), 400);
                return;
            }
            
            
            sendJsonResponse(exchange, new JSONObject().put("message", "NOT IMPLEMENTED"), 200);
        }

        public void handleDelete(HttpExchange exchange) throws IOException {
            // Deletes a user

            /**
             * Needs to have the following:
             *      - user_id
             *      - email
             *      - password
             * 
             */
            sendJsonResponse(exchange, new JSONObject().put("message", "NOT IMPLEMENTED"), 200);
        }

        public void handlePatch(HttpExchange exchange) throws IOException {
            /**
             * Needs to have the following:
             *      - userId
             * 
             * Could have the following:
             *      - name
             *      - email
             *      - hashed_password
             *      - UniversityId
             *      - coursesIdList
             *      - profile_description
             *      - reviewsIdList - not going to be sent here since new tutor has no reviews
             */

            sendJsonResponse(exchange, new JSONObject().put("message", "NOT IMPLEMENTED"), 200);
        }

    }

    /**
     * Method to read json files
     * @param filepath - The path to the json file
     * @return JSONObject - The json object
     * @throws IOException
     */
    private static JSONObject readJsonFile(String filepath) throws IOException {
        try (FileReader reader = new FileReader(filepath)) {
            return new JSONObject(new JSONTokener(reader));
        }
    }

    /**
     * Method to send a JSON response back to the client
     * @param exchange - The HttpExchange object
     * @param json - The JSON object to send
     * @param code - The response code (eg. 200)
     * @throws IOException
     */
    private static void sendJsonResponse(HttpExchange exchange, JSONObject json, int code) throws IOException {

        // Convert JSON to string
        String response = json.toString();

        // Send response headers
        exchange.getResponseHeaders().set("Content-Type", "application/json; charset=UTF-8");
        exchange.sendResponseHeaders(code, response.length());

        // Write response
        OutputStream os = exchange.getResponseBody();
        os.write(response.getBytes(StandardCharsets.UTF_8));
        os.close();
    }

    
}