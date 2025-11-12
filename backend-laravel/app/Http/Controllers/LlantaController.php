<?php

namespace App\Http\Controllers;

use App\Models\Llanta;
use Illuminate\Http\Request;

class LlantaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(Llanta::all(), 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'MARCA' => 'required|string',
            'MODELO_LLANTA' => 'nullable|string',
            'MEDIDA_RIN' => 'nullable|string',
            'MEDIDA_LLANTA' => 'nullable|string',
            'PRECIO' => 'required|numeric',
            'IMAGEN' => 'nullable|string',
            'CONDICION' => 'in:nueva,reacondicionada',
            'TIPO_VEHICULO' => 'nullable|string',
            'STOCK' => 'required|integer',
        ]);

        $llanta = Llanta::create($validated);
        return response()->json($llanta, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $llanta = Llanta::findOrFail($id);
        return response()->json($llanta, 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $llanta = Llanta::findOrFail($id);

        $validated = $request->validate([
            'MARCA' => 'sometimes|string',
            'MODELO_LLANTA' => 'nullable|string',
            'MEDIDA_RIN' => 'nullable|string',
            'MEDIDA_LLANTA' => 'nullable|string',
            'PRECIO' => 'sometimes|numeric',
            'IMAGEN' => 'nullable|string',
            'CONDICION' => 'in:nueva,reacondicionada',
            'TIPO_VEHICULO' => 'nullable|string',
            'STOCK' => 'sometimes|integer',
        ]);

        $llanta->update($validated);
        return response()->json($llanta, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $llanta = Llanta::findOrFail($id);
        $llanta->delete();
        return response()->json(['message' => 'Llanta eliminada'], 200);
    }
}
