<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTableShowSeatTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('show_seat', function (Blueprint $table) {
            $table->increments('id');
            $table->float('price');
            $table->integer('seat_id');
            $table->boolean('status');
            $table->string('reservation_id')->nullable();
            $table->integer('show_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('show_seat');
    }
}
