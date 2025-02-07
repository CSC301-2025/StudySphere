package ISCS;

import com.sun.net.httpserver.HttpServer;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpExchange;

import java.io.*;
import java.net.*;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.concurrent.*;
import java.util.logging.Level;
import java.util.logging.Logger;

public class ISCS {
    private static final Logger LOGGER = Logger.getLogger(ISCS.class.getName());
    private static final Map<String, List<String>> serviceRegistry = new HashMap<>();
    private static final Map<String, String> cache = new ConcurrentHashMap<>(); // Caching layer
    private static final Random random = new Random();

    public static void main(String[] args) throws IOException {
        
        // Register service instances (for load balancing)
        serviceRegistry.put("UserService", Arrays.asList("http://127.0.0.1+:14001"));
        serviceRegistry.put("StudentService", Arrays.asList("http://127.0.0.1+:14002"));
        serviceRegistry.put("TutorService", Arrays.asList("http://127.0.0.1+:14003"));


        // Create and start the HTTP server
        HttpServer server = HttpServer.create(new InetSocketAddress("127.0.0.1", 14004), 0);
        server.setExecutor(Executors.newFixedThreadPool(10)); // Thread pool for handling requests
        server.createContext("/forward", new ForwardHandler());
        server.createContext("/cache", new CacheHandler());
        server.start();
        LOGGER.info("ISCS started on port 16001");
    }

    static class ForwardHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if (!"POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                sendResponse(exchange, "Invalid HTTP method.", 405);
                return;
            }
            handlePostRequest(exchange);
        }

        private void handlePostRequest(HttpExchange exchange) throws IOException {
            String body = new String(exchange.getRequestBody().readAllBytes(), StandardCharsets.UTF_8);
            Map<String, String> payload = parseJson(body);

            // Check cache
            String cacheKey = generateCacheKey(payload);
            if (cache.containsKey(cacheKey)) {
                sendResponse(exchange, cache.get(cacheKey), 200);
                return;
            }

            // Determine target service
            String targetService = payload.get("service");
            if (targetService == null || !serviceRegistry.containsKey(targetService)) {
                sendResponse(exchange, "Invalid or missing service.", 400);
                return;
            }

            // Load balancing
            String serviceUrl = getRandomServiceInstance(targetService);
            if (serviceUrl == null) {
                sendResponse(exchange, "No available instances for service: " + targetService, 503);
                return;
            }

            try {
                String forwardResponse = forwardRequest(serviceUrl, payload);
                cache.put(cacheKey, forwardResponse); // Cache response
                sendResponse(exchange, forwardResponse, 200);
            } catch (Exception e) {
                LOGGER.log(Level.SEVERE, "Error forwarding request", e);
                sendResponse(exchange, "Error forwarding request: " + e.getMessage(), 500);
            }
        }

        private String forwardRequest(String serviceUrl, Map<String, String> payload) throws IOException {
            HttpURLConnection connection = (HttpURLConnection) new URL(serviceUrl).openConnection();
            connection.setRequestMethod("POST");
            connection.setDoOutput(true);
            connection.setRequestProperty("Content-Type", "application/json");

            try (OutputStream os = connection.getOutputStream()) {
                os.write(mapToJson(payload).getBytes(StandardCharsets.UTF_8));
            }

            try (BufferedReader br = new BufferedReader(new InputStreamReader(connection.getInputStream(), StandardCharsets.UTF_8))) {
                StringBuilder response = new StringBuilder();
                String line;
                while ((line = br.readLine()) != null) {
                    response.append(line);
                }
                return response.toString();
            }
        }

        private String getRandomServiceInstance(String service) {
            List<String> instances = serviceRegistry.get(service);
            return (instances == null || instances.isEmpty()) ? null : instances.get(random.nextInt(instances.size()));
        }
    }

    static class CacheHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if (!"GET".equalsIgnoreCase(exchange.getRequestMethod())) {
                sendResponse(exchange, "Invalid HTTP method.", 405);
                return;
            }
            handleGetRequest(exchange);
        }

        private void handleGetRequest(HttpExchange exchange) throws IOException {
            StringBuilder response = new StringBuilder("Cached Responses:\n");
            cache.forEach((key, value) -> response.append(key).append(" -> ").append(value).append("\n"));
            sendResponse(exchange, response.toString(), 200);
        }
    }

    private static Map<String, String> parseJson(String body) {
        Map<String, String> data = new HashMap<>();
        body = body.replaceAll("[{}\\\"]", "");
        for (String pair : body.split(",")) {
            String[] keyValue = pair.split(":");
            if (keyValue.length == 2) {
                data.put(keyValue[0].trim(), keyValue[1].trim());
            }
        }
        return data;
    }

    private static String mapToJson(Map<String, String> map) {
        StringBuilder jsonBuilder = new StringBuilder("{");
        for (Map.Entry<String, String> entry : map.entrySet()) {
            jsonBuilder.append("\"").append(entry.getKey()).append("\":\"").append(entry.getValue()).append("\", ");
        }
        if (!map.isEmpty()) {
            jsonBuilder.setLength(jsonBuilder.length() - 2);
        }
        jsonBuilder.append("}");
        return jsonBuilder.toString();
    }

    private static String generateCacheKey(Map<String, String> payload) {
        return payload.toString();
    }

    private static void sendResponse(HttpExchange exchange, String response, int statusCode) throws IOException {
        exchange.sendResponseHeaders(statusCode, response.getBytes(StandardCharsets.UTF_8).length);
        try (OutputStream os = exchange.getResponseBody()) {
            os.write(response.getBytes(StandardCharsets.UTF_8));
        }
    }
}
