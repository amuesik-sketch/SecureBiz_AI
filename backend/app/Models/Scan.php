<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Scan extends Model
{

    protected $fillable = [

        'user_id',

        'website',

        'score',

        'grade',

        'risk',

        'checks',

        'recommendations',

        'technologies',

        'vulnerabilities',

        'ai_analysis',

    ];



    protected $casts = [

        'checks'=>'array',

        'recommendations'=>'array',

        'technologies'=>'array',

        'vulnerabilities'=>'array',

    ];



    public function user()
    {

        return $this->belongsTo(User::class);

    }

}