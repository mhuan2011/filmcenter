<?php

namespace App\Http\Controllers;

use App\Events\NotificationReservation;
use App\Events\PusherEvent;
use Exception;
use Illuminate\Http\Request;

class NotiController extends Controller
{
    //
    public function index()
    {
        try {
            event(new NotificationReservation('hello world'));

            event(new PusherEvent('Someone'));
            return response()->json(
                [
                    "status" => "ok",
                    "message" => "send data successfull !!"
                ]
            );
        } catch (Exception $err) {
            return response()->json(
                [
                    "status" => "faild",
                    "message" => "send data error !!" . $err
                ]
            );
        }
    }
}
