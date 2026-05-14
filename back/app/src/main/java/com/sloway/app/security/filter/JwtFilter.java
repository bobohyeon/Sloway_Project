package com.sloway.app.security.filter;

import com.sloway.app.security.user.CustomUserDetails;
import com.sloway.app.security.user.UserVo;
import com.sloway.app.security.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String authorization = request.getHeader("Authorization");

        if(authorization == null || !authorization.startsWith("Bearer ")){  //느낌표 주의 ,,,
            System.out.println("토큰 없음 ...");
            filterChain.doFilter(request,response);
            return;
        }

        String token = authorization.split(" ")[1]; // "Bearer " 뒤에 있는 토큰 얻기
        if(jwtUtil.isExpired(token)){
            System.out.println("토큰 만료 ...");
            filterChain.doFilter(request, response);
            return;
        }

        Long memberNo = jwtUtil.getMemberNo(token);
        String email = jwtUtil.getEmail(token);
        String role = jwtUtil.getRole(token);

        UserVo vo = new UserVo();
        vo.setMemberNo(memberNo);
        vo.setEmail(email);
        vo.setRole(role);
        CustomUserDetails userDetails = new CustomUserDetails(vo);

        Authentication authToken = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

        SecurityContextHolder.getContext().setAuthentication(authToken);
        filterChain.doFilter(request, response);
    }
}
