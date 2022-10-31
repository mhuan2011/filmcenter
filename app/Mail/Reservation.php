<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class Reservation extends Mailable
{
    use Queueable, SerializesModels;
    public $data;
    public $name;
    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($order_id, $name)
    {
        //
        $this->data = [
            'order_id' => $order_id,
            'name' => $name
        ];
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->from($address = 'filmcenter.site@gmail.com', $name = 'Fimcenter.site')
            ->subject("You reservation")
            ->view('reservation', ['data' => $this->data]);
    }
}
