<?php

namespace App\Services;

class SecurityAnalyzer
{
    public function analyze(string $website): array
    {
        if (!preg_match('/^https?:\/\//', $website)) {
            $website = "https://" . $website;
        }

        $host = parse_url($website, PHP_URL_HOST);

        $scanUrl = $host
            ? "https://" . $host
            : $website;


        $result = [
            'website' => $website,
            'score' => 0,
            'grade' => '',
            'risk' => 'High',
            'checks' => [],
            'recommendations' => [],
            'technologies' => [],
            'vulnerabilities' => [],
            'html' => '',
        ];


        $headerData = $this->getHeaders($scanUrl);
        $html = $this->getHTML($scanUrl);


        if (!$headerData) {

            $result['recommendations'][] =
                "Website could not be scanned. The server may be blocking automated security checks.";

            $result['vulnerabilities'][] = [

                "title" => "Website Unreachable",

                "severity" => "Medium",

                "category" =>
                    "Availability Monitoring",

                "cwe" =>
                    "CWE-754",

                "description" =>
                    "The security scanner was unable to communicate with the website server.",

                "impact" =>
                    "Security controls cannot be verified, leaving unknown risks undetected.",

                "attack" =>
                    "Attackers may exploit unknown weaknesses that cannot be assessed.",

                "fix" =>
                    "Ensure the website is online and allows legitimate security monitoring."
            ];


            $result['grade'] = "F";

            return $result;
        }


        $headers = $headerData['headers'];

        $finalUrl = $headerData['final_url'];

        $usedHttps =
            strtolower((string) parse_url($finalUrl, PHP_URL_SCHEME))
            === 'https';



        /*
        =====================================
        HTTPS CHECK
        =====================================
        */

        if ($usedHttps) {

            $this->addCheck(
                $result,
                "HTTPS Encryption",
                "Passed",
                20
            );


        } else {


            $this->addCheck(
                $result,
                "HTTPS Encryption",
                "Failed",
                0
            );


            $result['vulnerabilities'][] = [

                "title" =>
                    "Cleartext HTTP Communication",

                "severity" =>
                    "High",

                "category" =>
                    "OWASP A02:2021 - Cryptographic Failures",

                "cwe" =>
                    "CWE-319",

                "description" =>
                    "The website allows communication without encrypted HTTPS protection.",

                "impact" =>
                    "Sensitive information such as login credentials, cookies, or user data may be intercepted.",

                "attack" =>
                    "An attacker on the network could perform traffic interception or man-in-the-middle attacks.",

                "fix" =>
                    "Install a trusted TLS certificate and redirect all HTTP traffic to HTTPS."
            ];


            $result['recommendations'][] =
                "Enable HTTPS and redirect all HTTP requests to secure HTTPS connections.";
        }



        /*
        =====================================
        SSL CHECK
        =====================================
        */


        if ($this->checkSSL($scanUrl)) {


            $this->addCheck(
                $result,
                "SSL Certificate",
                "Passed",
                20
            );


        } else {


            $this->addCheck(
                $result,
                "SSL Certificate",
                "Failed",
                0
            );


            $result['vulnerabilities'][] = [

                "title" =>
                    "Invalid SSL/TLS Certificate",

                "severity" =>
                    "High",

                "category" =>
                    "OWASP A02:2021 - Cryptographic Failures",

                "cwe" =>
                    "CWE-295",

                "description" =>
                    "The website does not present a valid trusted SSL certificate.",

                "impact" =>
                    "Users may connect to an untrusted website or become vulnerable to certificate-based attacks.",

                "attack" =>
                    "Attackers may attempt to impersonate the website using fraudulent certificates.",

                "fix" =>
                    "Install and maintain a valid certificate from a trusted certificate authority."
            ];


            $result['recommendations'][] =
                "Install a valid SSL/TLS certificate.";
        }

                /*
        =====================================
        SECURITY HEADERS CHECK
        =====================================
        */

        $securityHeaders = [

            "strict-transport-security" => [
                "name" => "HTTP Strict Transport Security (HSTS)",
                "points" => 8,
                "severity" => "Medium",
                "category" => "OWASP A05:2021 - Security Misconfiguration",
                "cwe" => "CWE-693",
                "description" =>
                    "The website does not enforce browsers to communicate only through HTTPS.",
                "impact" =>
                    "Users may accidentally access an insecure version of the website.",
                "attack" =>
                    "Attackers may attempt downgrade attacks by forcing HTTP communication.",
                "fix" =>
                    "Enable the Strict-Transport-Security response header."
            ],


            "content-security-policy" => [
                "name" => "Content Security Policy (CSP)",
                "points" => 8,
                "severity" => "Medium",
                "category" => "OWASP A05:2021 - Security Misconfiguration",
                "cwe" => "CWE-693",
                "description" =>
                    "The website does not define rules controlling which scripts and resources browsers can load.",
                "impact" =>
                    "The risk of Cross-Site Scripting (XSS) attacks is increased.",
                "attack" =>
                    "An attacker may inject malicious JavaScript into pages viewed by users.",
                "fix" =>
                    "Implement a strict Content-Security-Policy header."
            ],


            "x-frame-options" => [
                "name" => "Clickjacking Protection",
                "points" => 5,
                "severity" => "Medium",
                "category" => "OWASP A05:2021 - Security Misconfiguration",
                "cwe" => "CWE-1021",
                "description" =>
                    "The website does not prevent other websites from embedding its pages.",
                "impact" =>
                    "Users may unknowingly interact with hidden malicious overlays.",
                "attack" =>
                    "Attackers can create fake interfaces that trick users into clicking sensitive actions.",
                "fix" =>
                    "Add X-Frame-Options or frame-ancestors CSP rules."
            ],


            "x-content-type-options" => [
                "name" => "MIME Type Protection",
                "points" => 5,
                "severity" => "Low",
                "category" => "OWASP A05:2021 - Security Misconfiguration",
                "cwe" => "CWE-693",
                "description" =>
                    "The browser is not instructed to strictly follow declared content types.",
                "impact" =>
                    "Some browsers may incorrectly interpret malicious files.",
                "attack" =>
                    "Attackers may attempt MIME confusion attacks.",
                "fix" =>
                    "Enable X-Content-Type-Options: nosniff."
            ],


            "referrer-policy" => [
                "name" => "Referrer Policy",
                "points" => 4,
                "severity" => "Low",
                "category" => "Privacy Configuration",
                "cwe" => "CWE-200",
                "description" =>
                    "The website does not control how much browsing information is shared.",
                "impact" =>
                    "Sensitive URL information may leak to external websites.",
                "attack" =>
                    "Attackers may collect information from leaked referrer data.",
                "fix" =>
                    "Configure a strict Referrer-Policy header."
            ]
        ];



        foreach ($securityHeaders as $header => $info) {


            if (isset($headers[$header])) {


                $this->addCheck(
                    $result,
                    $info['name'],
                    "Passed",
                    $info['points']
                );


            } else {


                $this->addCheck(
                    $result,
                    $info['name'],
                    "Warning",
                    0
                );


                $result['recommendations'][] =
                    $info['fix'];


                $result['vulnerabilities'][] = [

                    "title" =>
                        "Missing " . $info['name'],

                    "severity" =>
                        $info['severity'],

                    "category" =>
                        $info['category'],

                    "cwe" =>
                        $info['cwe'],

                    "description" =>
                        $info['description'],

                    "impact" =>
                        $info['impact'],

                    "attack" =>
                        $info['attack'],

                    "fix" =>
                        $info['fix']
                ];
            }
        }




        /*
        =====================================
        COOKIE SECURITY CHECK
        =====================================
        */


        if (isset($headers['set-cookie'])) {


            $cookie =
                strtolower($headers['set-cookie']);


            $missingFlags = [];


            if (!str_contains($cookie, 'secure')) {

                $missingFlags[] = "Secure";

            }


            if (!str_contains($cookie, 'httponly')) {

                $missingFlags[] = "HttpOnly";

            }


            if (!str_contains($cookie, 'samesite')) {

                $missingFlags[] = "SameSite";

            }



            if (empty($missingFlags)) {


                $this->addCheck(
                    $result,
                    "Secure Cookies",
                    "Passed",
                    15
                );


            } else {


                $this->addCheck(
                    $result,
                    "Secure Cookies",
                    "Warning",
                    0
                );


                $flags =
                    implode(", ", $missingFlags);



                $result['vulnerabilities'][] = [

                    "title" =>
                        "Weak Session Cookie Configuration",

                    "severity" =>
                        "Medium",

                    "category" =>
                        "OWASP A05:2021 - Security Misconfiguration",

                    "cwe" =>
                        "CWE-614",

                    "description" =>
                        "Application cookies are missing important security attributes.",

                    "impact" =>
                        "Session cookies may be stolen or abused by attackers.",

                    "attack" =>
                        "Attackers may exploit XSS or insecure connections to capture user sessions.",

                    "fix" =>
                        "Enable the following cookie attributes: " . $flags
                ];
            }



        } else {


            $this->addCheck(
                $result,
                "Secure Cookies",
                "Warning",
                0
            );
        }


        /*
        =====================================
        SERVER INFORMATION EXPOSURE
        =====================================
        */

        if (isset($headers['server']) || isset($headers['x-powered-by'])) {


            $this->addCheck(
                $result,
                "Server Information Exposure",
                "Warning",
                0
            );


            $result['vulnerabilities'][] = [

                "title" =>
                    "Technology Version Disclosure",

                "severity" =>
                    "Low",

                "category" =>
                    "OWASP A05:2021 - Security Misconfiguration",

                "cwe" =>
                    "CWE-200",

                "description" =>
                    "The server reveals information about the technologies running the application.",

                "impact" =>
                    "Attackers can use exposed information to identify possible vulnerable software versions.",

                "attack" =>
                    "An attacker may perform targeted attacks against known weaknesses in detected technologies.",

                "fix" =>
                    "Remove Server and X-Powered-By headers from HTTP responses."
            ];


        } else {


            $this->addCheck(
                $result,
                "Server Information Exposure",
                "Passed",
                10
            );
        }




        /*
        =====================================
        TECHNOLOGY DETECTION
        =====================================
        */

        $result['technologies'] =
            $this->detectTechnologies(
                $headers,
                $html
            );


        $result['html'] = $html;



        /*
        =====================================
        CLEAN DUPLICATES
        =====================================
        */

        $result['recommendations'] =
            array_values(
                array_unique(
                    $result['recommendations']
                )
            );


        $result['vulnerabilities'] =
            $this->deduplicateVulnerabilities(
                $result['vulnerabilities']
            );




        if ($result['score'] > 100) {

            $result['score'] = 100;

        }



        /*
        =====================================
        RISK CALCULATION
        =====================================
        */

        if ($result['score'] >= 80) {

            $result['risk'] = "Low";

        } elseif ($result['score'] >= 60) {

            $result['risk'] = "Medium";

        } else {

            $result['risk'] = "High";

        }



        $result['grade'] =
            $this->calculateGrade(
                $result['score']
            );


        return $result;
    }




    private function addCheck(&$result, $name, $status, $points)
    {

        $result['checks'][] = [

            "name" => $name,

            "status" => $status
        ];


        $result['score'] += $points;
    }





    private function deduplicateVulnerabilities(array $vulnerabilities)
    {

        $unique = [];

        $seen = [];


        foreach ($vulnerabilities as $vulnerability) {


            $key =
                strtolower(
                    trim(
                        $vulnerability['title'] ?? ''
                    )
                );


            if ($key === '') {

                continue;

            }


            if (!isset($seen[$key])) {


                $seen[$key] = true;

                $unique[] = $vulnerability;

            }

        }


        return $unique;
    }






    private function checkSSL($website)
    {

        $host =
            parse_url(
                $website,
                PHP_URL_HOST
            );


        if (!$host) {

            return false;

        }


        $context =
            stream_context_create([

                "ssl" => [

                    "capture_peer_cert" => true,

                    "verify_peer" => false,

                    "verify_peer_name" => false
                ]

            ]);



        $connection =
            @stream_socket_client(

                "ssl://" . $host . ":443",

                $errno,

                $errstr,

                10,

                STREAM_CLIENT_CONNECT,

                $context
            );



        if ($connection === false) {

            return false;

        }


        fclose($connection);


        return true;
    }







    private function getHeaders($website)
    {

        $curl = curl_init();


        curl_setopt_array($curl,[

            CURLOPT_URL => $website,

            CURLOPT_RETURNTRANSFER => true,

            CURLOPT_HEADER => true,

            CURLOPT_NOBODY => true,

            CURLOPT_TIMEOUT => 20,

            CURLOPT_FOLLOWLOCATION => true,

            CURLOPT_SSL_VERIFYPEER => false,

            CURLOPT_SSL_VERIFYHOST => false,

            CURLOPT_USERAGENT =>
                "Mozilla/5.0 SecurityScanner"

        ]);



        $response =
            curl_exec($curl);



        if (!$response) {

            curl_close($curl);

            return null;

        }



        $finalUrl =
            curl_getinfo(
                $curl,
                CURLINFO_EFFECTIVE_URL
            );



        curl_close($curl);



        $headers = [];



        foreach (
            explode(
                "\r\n",
                $response
            ) as $line
        ) {


            if (str_contains($line, ":")) {


                [$key,$value] =
                    explode(
                        ":",
                        $line,
                        2
                    );


                $headers[
                    strtolower(trim($key))
                ] =
                    trim($value);
            }
        }



        return [

            "headers" => $headers,

            "final_url" => $finalUrl

        ];

    }






    private function getHTML($website)
    {

        $curl = curl_init();


        curl_setopt_array($curl,[

            CURLOPT_URL => $website,

            CURLOPT_RETURNTRANSFER => true,

            CURLOPT_TIMEOUT => 20,

            CURLOPT_FOLLOWLOCATION => true,

            CURLOPT_SSL_VERIFYPEER => false,

            CURLOPT_SSL_VERIFYHOST => false,

            CURLOPT_USERAGENT =>
                "Mozilla/5.0 SecurityScanner"

        ]);



        $html =
            curl_exec($curl);


        curl_close($curl);



        return $html ?: "";

    }



    private function detectTechnologies($headers,$html)
    {

        $technologies = [];


        $data =
            strtolower(
                json_encode($headers)
                . $html
            );



        if (str_contains($data,"cloudflare")) {

            $technologies[] = "Cloudflare";

        }


        if (str_contains($data,"wordpress")) {

            $technologies[] = "WordPress";

        }


        if (str_contains($data,"react")) {

            $technologies[] = "React";

        }


        if (str_contains($data,"laravel")) {

            $technologies[] = "Laravel";

        }


        if (isset($headers['x-powered-by'])) {

            $technologies[] =
                $headers['x-powered-by'];

        }



        if(empty($technologies)) {

            $technologies[] =
                "Unknown / Hidden";

        }


        return array_values(
            array_unique($technologies)
        );

    }






    private function calculateGrade($score)
    {

        if ($score >= 95) {

            return "A+";

        }

        if ($score >= 85) {

            return "A";

        }

        if ($score >= 75) {

            return "B";

        }

        if ($score >= 65) {

            return "C";

        }

        if ($score >= 50) {

            return "D";

        }


        return "F";

    }

}
