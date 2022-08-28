<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Stars extends Model
{
    use HasFactory;
    protected $table = 'stars';
    protected $guarded = [];
    public $timestamps = false;
}
