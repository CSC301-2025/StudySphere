package StudentService;

import UserService.User;
import java.util.HashMap;
import java.util.Map;

public class StudentService {
    
    private final Map<Integer, User> students = new HashMap<>();
    
    public synchronized String createOrUpdate(User user) {
        students.put(user.getId(), user);
        return "User created or updated successfully";
    }
    
    public synchronized User getStudent(int id) {
        return students.get(id);
    }
    
    public synchronized String updateStudent(User user) {
        if (students.containsKey(user.getId())) {
            students.put(user.getId(), user);
            return "User updated successfully";
        }
        return "User not found";
    }
    
    public synchronized Map<Integer, User> getAllStudents() {
        return new HashMap<>(students);
    }
    
    // Inter-service communication via ISCS
    public String applyToBecomeTutor(int userId) {
        // Logic to send request via ISCS
        // *NEEDS TO BE IMPLEMENTED BUT NEED TO DISCUSS WITH GROUP DOING IT WITH TUTOR*
        return "Request to become a tutor sent for user: " + userId;
    }
    
    public String searchTutors(String filter) {
        // Logic to query available tutors through ISCS
        // *NEEDS TO BE IMPLEMENTED BUT NEED TO DISCUSS WITH GROUP DOING IT WITH TUTOR*
        return "Searching tutors with filter: " + filter;
    }
}

