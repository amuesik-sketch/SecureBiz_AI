<?php

namespace App\Services;

class AISecurityAnalyzer
{
    public function analyze(array $scan): string
    {

        $risk = $scan['risk'];
        $score = $scan['score'];
        $website = $scan['website'];


        return "
Security analysis report for {$website}.

The website received a security score of {$score}/100 with an overall risk rating of {$risk}.

The scan evaluated important security areas including HTTPS configuration, SSL certificate status, security headers, cookie protection, exposed server information, and detected technologies.

The main security improvements should focus on addressing the detected vulnerabilities and applying the recommended security configurations. Implementing HTTPS, strengthening HTTP security headers, protecting cookies, and reducing unnecessary information exposure will improve the website's security posture.

Overall, the website requires attention to the identified security weaknesses before it can be considered fully secure.
";

    }
}