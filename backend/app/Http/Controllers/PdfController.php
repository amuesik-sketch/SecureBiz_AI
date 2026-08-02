<?php

namespace App\Http\Controllers;

use App\Models\Scan;
use Barryvdh\DomPDF\Facade\Pdf;

class PdfController extends Controller
{
    public function download($id)
    {
        try {

            $scan = Scan::findOrFail($id);


            $pdf = Pdf::loadView(
                'reports.security',
                [
                    'scan' => $scan
                ]
            );


            $pdf->setOptions([
                'defaultFont' => 'DejaVu Sans',
                'isRemoteEnabled' => true,
            ]);


            return $pdf->download(
                'SecureBiz-AI-Security-Report.pdf'
            );


        } catch (\Exception $e) {


            return response()->json([

                'message' => 'PDF generation failed',

                'error' => $e->getMessage(),

                'line' => $e->getLine(),

                'file' => $e->getFile()

            ], 500);


        }
    }
}