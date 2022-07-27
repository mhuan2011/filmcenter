<?php

namespace App\Http\Controllers;

use App\Models\Country;
use Illuminate\Http\Request;

class CountryController extends Controller
{
    //
    public function getlist()
    {
        $data = Country::orderBy('name', 'ASC')->get();
        return response()->json([
            'status' => true,
            'data' => $data,
        ]);
    }
}
