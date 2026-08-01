<?php

namespace App\Http\Controllers;

use App\Models\Scan;
use Barryvdh\DomPDF\Facade\Pdf;

class PdfController extends Controller
{

    public function download($id)
    {

        $scan = Scan::findOrFail($id);


        $pdf = Pdf::loadView(
            'reports.security',
            [
                'scan' => $scan
            ]
        );


        // Enable better character rendering
        $pdf->setOptions([
            'defaultFont' => 'DejaVu Sans',
            'isRemoteEnabled' => true,
        ]);


        return $pdf->download(
            'SecureBiz-AI-Security-Report.pdf'
        );

    }

}