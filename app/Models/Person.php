<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Person extends Model
{
    use HasFactory;
    protected $guarded = [];

    protected $table = 'person';
    protected $primaryKey = 'person_id';

    public $timestamps = false;
}
