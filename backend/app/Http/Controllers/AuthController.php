<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;


class AuthController extends Controller
{


    public function register(Request $request)
    {

        $request->validate([

            'name'=>'required',

            'email'=>'required|email|unique:users',

            'password'=>'required|min:6'

        ]);



        $user = User::create([

            'name'=>$request->name,

            'email'=>$request->email,

            'password'=>Hash::make($request->password)

        ]);



        return response()->json([

            'message'=>'User created successfully',

            'user'=>$user

        ]);

    }




    public function login(Request $request)
    {

        $user = User::where(
            'email',
            $request->email
        )->first();



        if(!$user || !Hash::check(
            $request->password,
            $user->password
        )){


            return response()->json([

                'message'=>'Invalid credentials'

            ],401);

        }



        $token =
        $user->createToken('securebiz')->plainTextToken;



        return response()->json([

            'token'=>$token,

            'user'=>$user

        ]);

    }


}