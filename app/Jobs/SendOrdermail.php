<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use App\Mail\Reservation as MailReservation;
use Illuminate\Support\Facades\Mail;

class SendOrdermail implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;
    protected $data;
    protected $mail;
    protected $name;
    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct($mail, $data, $name)
    {
        //
        $this->data = $data;
        $this->mail = $mail;
        $this->name = $name;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        Mail::to($this->mail)->send(new MailReservation($this->data, $this->name));
    }
}
