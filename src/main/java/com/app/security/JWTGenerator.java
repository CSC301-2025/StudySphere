package com.app.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.Authentication;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.stereotype.Component;

import com.app.User.UserEntity;

import javax.crypto.SecretKey;
import java.util.Base64;
import java.util.Date;
// import java.util.List;
// import java.util.stream.Collectors;

@Component
public class JWTGenerator {

    // Secret Key
    private final SecretKey key = Keys.hmacShaKeyFor(Base64.getDecoder().decode(SecurityConstants.JWTSECRET));
    
    public String generateRefreshToken(Authentication authentication) {
        UserEntity user = (UserEntity) authentication.getPrincipal();
        String userId = user.getId();  // Get the id
        Date currentDate = new Date();
        Date expireDate = new Date(currentDate.getTime() + SecurityConstants.JWTEXPIRATIONREFRESH);

        return Jwts.builder()
                .setSubject(userId)  // Use the id as the subject
                .setIssuedAt(currentDate)
                .setExpiration(expireDate)
                .signWith(key)
                .compact();
    }

    public String generateAccessToken(String userId) {
        Date currentDate = new Date();
        Date expireDate = new Date(currentDate.getTime() + SecurityConstants.JWTEXPIRATIONACCESS);

        return Jwts.builder()
                .setSubject(userId) // Set the subject to the user id
                .setIssuedAt(currentDate)
                .setExpiration(expireDate)
                .signWith(key)
                .compact();
    }


    public String getUserIdFromJWT(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
        
        System.out.println("Getting User ID in JWTGenerator getUserIdFromJWT");
        System.out.println(claims.getSubject());
        return claims.getSubject();  // Retrieve the user id
    }

    // public List<String> getRolesFromJWT(String token) {
    //     Claims claims = Jwts.parserBuilder()
    //             .setSigningKey(key)
    //             .build()
    //             .parseClaimsJws(token)
    //             .getBody();
        
    //     List<?> rolesList = claims.get("ROLES", List.class);
    //     List<String> roles = rolesList.stream()
    //                                 .map(Object::toString)
    //                                 .collect(Collectors.toList());
    //     return roles;
    // }
    

    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
            return true;
        }
        catch (Exception e) {
            throw new AuthenticationCredentialsNotFoundException("JWT was expired or incorrect");
        }
    }
}
