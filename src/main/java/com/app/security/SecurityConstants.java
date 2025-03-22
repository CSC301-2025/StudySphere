package com.app.security;

public class SecurityConstants {

    public static final long JWTEXPIRATIONACCESS = 1000 * 60 * 60; // 1 Hour

    public static final long JWTEXPIRATIONREFRESH = 1000 * 60 * 60 * 24 * 7; // 1 Week

    //TODO: MAKE SURE TO CHANGE TO KEY OBJECT SYSTEM
    protected static final String JWTSECRET = "T4l+F/qWtKDhlWHUqWmaXUyaB53r3X/5lEb5ccEofTeb307wprn6UMdu2lF3kIL3Mr9zLVM/RLZnJzEQW/M3Sw==";
}
