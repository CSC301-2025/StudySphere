package UserService;

import java.util.Objects;
public class User {

    private int userID;
    private String name;
    private String description;
    private String email;
    private String password;
    private String[] courses;
    private String[] reviewsID;
    private int authorization; // 0 -> Student and 1 -> Tutor

    public User(int userID, String name, String description, String email, String password, String[] courses, String[] reviewsID, int authorization) {
        this.userID = userID;
        this.name = name;
        this.description = description;
        this.email = email;
        this.password = password;
        this.courses = courses; 
        this.reviewsID = reviewsID; 
        this.authorization = authorization; 
    }

    public int getId() {
        return userID;
    }

    public void setId(int userID) {
        this.userID = userID;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String[] getCourses() {
        return courses;
    }

    public void addCourse(String course) {
        this.courses[this.courses.length] = course; 
    }

    public String[] getReviews() {
        return reviewsID;
    }

    public void addReview(String review) {
        this.reviewsID[this.reviewsID.length] = review; 
    }

    public int getAuthorization() {
        return authorization;
    }

    public void setAuthorization(int authorization) {
        this.authorization = authorization;
    }



    @Override
    public boolean equals(Object o) {
        // Will not check if courses, reviews, and description are identical for deleting
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        User user = (User) o;
        return userID == user.userID &&
                Objects.equals(name, user.name) &&
                Objects.equals(email, user.email) &&
                Objects.equals(password, user.password) &&
                Objects.equals(description, user.description) &&
                Objects.equals(authorization, user.authorization);
    }

    @Override
    public String toString() {
        String role;
        if (authorization == 1){
            role = "Tutor";
        } else role = "Student"; 
        
        return "User{" +
                "id=" + userID +
                ", name='" + name + '\'' +
                ", email='" + email + '\'' +
                ", password='" + password + '\'' +
                ", description='" + description + '\'' +
                ", courses='" + courses + '\'' +
                ", reviewsID='" + reviewsID + '\'' +
                ", Authorization='" + role + '\'' +
                '}';
    }
}
