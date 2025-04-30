<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class Newsletter extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public $subject;
    public $htmlContent;

    /**
     * Create a new message instance.
     */
    public function __construct($subject, $content)
    {
        $this->subject = $subject;
        $this->htmlContent = $this->generateHtmlEmail($subject, $content);
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: $this->subject,
        );
    }

    /**
     * Build the message.
     */
    public function build()
    {
        return $this->html($this->htmlContent);
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }

    /**
     * Generate HTML email content directly in PHP
     */
    private function generateHtmlEmail($subject, $content)
    {
        $year = date('Y');

        return <<<HTML
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>{$subject}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background-color: #4a90e2;
            padding: 20px;
            color: white;
            text-align: center;
            border-radius: 5px 5px 0 0;
        }
        .content {
            padding: 20px;
            background-color: #f9f9f9;
            border: 1px solid #ddd;
            border-top: none;
            border-radius: 0 0 5px 5px;
        }
        .footer {
            text-align: center;
            margin-top: 20px;
            font-size: 12px;
            color: #777;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>{$subject}</h1>
    </div>
    <div class="content">
        {$content}
    </div>
    <div class="footer">
        <p>© {$year} BlaBlaMe. All rights reserved.</p>
        <p>If you wish to unsubscribe from our newsletters, please visit your account settings.</p>
    </div>
</body>
</html>
HTML;
    }
}
