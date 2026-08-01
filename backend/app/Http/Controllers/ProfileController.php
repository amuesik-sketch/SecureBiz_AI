<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class ProfileController extends Controller
{

    public function index(Request $request)
    {

        $user = $request->user();


        $scans = $user->scans;


        return response()->json([

            "user" => [

                "name" => $user->name,

                "email" => $user->email,

                "joined" => $user->created_at->format('M d, Y'),

            ],


            "statistics" => [

                "totalScans" => $scans->count(),

                "averageScore" => $scans->count()
                    ? round($scans->avg('score'))
                    : 0,


                "lowRisk" => $scans
                    ->where('risk','Low')
                    ->count(),


                "mediumRisk" => $scans
                    ->where('risk','Medium')
                    ->count(),


                "highRisk" => $scans
                    ->where('risk','High')
                    ->count(),

                    "status" => "Active",
            ]

        ]);

    }





    public function update(Request $request)
    {

        $user = $request->user();


        $request->validate([

            'name'=>'required|string|max:255',

            'email'=>'required|email|unique:users,email,'.$user->id

        ]);



        $user->update([

            'name'=>$request->name,

            'email'=>$request->email

        ]);



        return response()->json([

            "message"=>"Profile updated successfully",

            "user"=>$user

        ]);

    }







    public function changePassword(Request $request)
    {

        $user = $request->user();



        $request->validate([

            'current_password'=>'required',

            'password'=>'required|min:8|confirmed'

        ]);




        if(!Hash::check(
            $request->current_password,
            $user->password
        )){

            return response()->json([

                "message"=>"Current password is incorrect"

            ],400);

        }





        $user->update([

            'password'=>Hash::make(
                $request->password
            )

        ]);




        return response()->json([

            "message"=>"Password changed successfully"

        ]);

    }


}