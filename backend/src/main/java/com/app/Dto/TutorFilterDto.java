
package com.app.Dto;

import java.util.List;
import lombok.Data;

@Data
public class TutorFilterDto {
    private String university;
    private List<String> courses;
    private String location;
    private PriceRangeDto priceRange;
    
    @Data
    public static class PriceRangeDto {
        private Double min;
        private Double max;
    }
}
