package TutorService;
import java.util.ArrayList;
import java.util.Objects;
public class Tutor {

    private int id;

    private final int university_id;

    private String username;
    private String email;
    private String password;
    public ArrayList<String> courses;
    public ArrayList<String> reviews;
    private String description;



    public Tutor(int id, int university_id, String username, String email, String password, ArrayList<String> courses, String description) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
        this.courses = courses;
        this.university_id = university_id;
        this.description = description;
        this.reviews = new ArrayList<>();

    }

    public ArrayList<String> getCourses() {
        return courses;
    }

    public void addCourse(String course) {
        this.courses.add(course);
    }

    public void deleteCourse(String course) {
        this.courses.remove(course);
    }

    public ArrayList<String> getReviews() {
        return reviews;
    }

    public void addReview(String review) {
        this.courses.add(review);
    }

    public int getId() {
        return id;
    }

    public int getUniversity_id() {
        return university_id;
    }

    public void setId(int id) {
        this.id = id ;
    }

    public String getUsername() {
        return username;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setUsername(String username) {
        this.username = username;
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

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Tutor tutor = (Tutor) o;
        return id == tutor.id &&
                Objects.equals(username, tutor.username) &&
                Objects.equals(email, tutor.email) &&
                Objects.equals(password, tutor.password);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, username, email, password);
    }

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", username='" + username + '\'' +
                ", email='" + email + '\'' +
                ", password='" + password + '\'' +
                '}';
    }
}
