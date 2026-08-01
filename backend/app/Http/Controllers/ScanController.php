<?php

namespace App\Http\Controllers;

use App\Models\Scan;
use App\Services\SecurityAnalyzer;
use App\Services\AISecurityAnalyzer;
use Illuminate\Http\Request;

class ScanController extends Controller
{

    public function store(Request $request)
    {

        $request->validate([
            'website'=>'required|string'
        ]);


        $analyzer = new SecurityAnalyzer();


        $result = $analyzer->analyze(
            $request->website
        );


        $ai = new AISecurityAnalyzer();


        $result['ai_analysis'] = $ai->analyze($result);



        $scan = Scan::create([

            'user_id'=>$request->user()->id,

            'website'=>$result['website'],

            'score'=>$result['score'],

            'grade'=>$result['grade'],

            'risk'=>$result['risk'],

            'checks'=>$result['checks'],

            'recommendations'=>$result['recommendations'],

            'technologies'=>$result['technologies'],

            'vulnerabilities'=>$result['vulnerabilities'] ?? [],

            'ai_analysis'=>$result['ai_analysis']

        ]);



        return response()->json($scan);

    }



    public function index(Request $request)
    {

        return response()->json(

            $request->user()
            ->scans()
            ->latest()
            ->get()

        );

    }



    public function show($id)
    {

        return response()->json(
            Scan::findOrFail($id)
        );

    }



    public function dashboard(Request $request)
    {

        $scans =
        $request->user()
        ->scans()
        ->latest()
        ->get();



        return response()->json([

            "totalScans"=>$scans->count(),

            "averageScore"=>round(
                $scans->avg('score') ?? 0
            ),

            "lowRisk"=>$scans
            ->where('risk','Low')
            ->count(),

            "mediumRisk"=>$scans
            ->where('risk','Medium')
            ->count(),

            "highRisk"=>$scans
            ->where('risk','High')
            ->count(),

            "recentScans"=>$scans->take(5)

        ]);

    }


    public function destroy($id, Request $request)
{

    $scan = $request->user()
        ->scans()
        ->findOrFail($id);


    $scan->delete();


    return response()->json([

        "message" => "Scan deleted successfully"

    ]);

}
}