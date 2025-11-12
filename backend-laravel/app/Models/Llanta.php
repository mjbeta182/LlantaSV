<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Llanta extends Model
{
    protected $table = 'llantas';

    protected $fillable = [
        'MARCA',
        'MODELO_LLANTA',
        'MEDIDA_RIN',
        'MEDIDA_LLANTA',
        'PRECIO',
        'IMAGEN',
        'CONDICION',
        'TIPO_VEHICULO',
        'STOCK',
    ];

    protected $casts = [
        'PRECIO' => 'decimal:2',
        'STOCK' => 'integer',
    ];

    // Relaciones
    public function pedidoItems()
    {
        return $this->hasMany(PedidoItem::class, 'LLANTA_ID');
    }
}
