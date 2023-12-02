from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import *
from .serializers import *
from datetime import datetime
from django.db.models import Sum, F, Value
from django.db.models.functions import Coalesce
from django.db.models import Case, When, Value
from itertools import groupby
from operator import itemgetter
from django.utils import timezone
from django.db.models.functions import TruncDate

@api_view(["GET"])
def Traer_usuarios(request):
    usuarios = Usuarios.objects.all()
    serializer = UsuarioSerializer(usuarios, many=True)
    return Response(serializer.data)


@api_view(['POST'])
def Iniciar_sesion(request):
    usuario_data = request.data
    if not usuario_data.get('rut'):
        return Response({'mensaje': "No Se a ingresado Usuario", 'estado': False})
    if not usuario_data.get('password'):
        return Response({'mensaje': "No Se a ingresado Contraseña", 'estado': False})
    usuario = Usuarios.objects.filter(usu_rut=usuario_data.get('rut')).first()
    if not usuario:
        return Response({'mensaje': "Usuario no válido", 'estado': False})
    serializer = UsuarioSerializer(usuario)
    if usuario.usu_password == usuario_data.get('password') and usuario.usu_estado == 0:
        return Response({'mensaje': "Usuario Deshabilitado", 'estado': False})
    if usuario.usu_password == usuario_data.get('password'):
        return Response({'mensaje': "Usuario y contraseña válidos", 'estado': True, 'rol': serializer.data['usu_rol'], 'id': serializer.data['usu_id']})
    else:
        return Response({'mensaje': "Contraseña no Valida", 'estado': False})


@api_view(["GET"])
def Traer_Productos(request):
    producto = Productos.objects.filter(pro_estado=1).values(
        'pro_id', 'pro_nombre', 'pro_marca__mar_nombre', 'pro_stock', 'pro_precio').order_by('pro_id')
    if producto:
        return Response({'estado': True, 'data': producto})
    return Response({'estado': False})


@api_view(["GET"])
def Traer_ProductosDes(request):
    producto = Productos.objects.filter(pro_estado=0).values(
        'pro_id', 'pro_nombre', 'pro_marca__mar_nombre', 'pro_stock', 'pro_precio').order_by('pro_id')
    if producto:
        return Response({'estado': True, 'data': producto})
    return Response({'estado': False})


@api_view(["POST"])
def Descontar_Producto(request):
    if request.method == "POST":
        producto_id = request.data.get("producto_id")
        cantidad_a_descontar = request.data.get("cantidad_a_descontar")
        usu_id = request.data.get("usu_id")

        try:
            producto = Productos.objects.get(pro_id=producto_id)
            producto.pro_stock = int(producto.pro_stock)
            cantidad_a_descontar = int(cantidad_a_descontar)
            if producto.pro_stock >= cantidad_a_descontar:
                producto.pro_stock -= cantidad_a_descontar
                producto.save()
                historial_data = {
                    'his_usuario': usu_id,
                    'his_producto': producto_id,
                    'his_fecha_modificacion': datetime.now(),
                    'his_modificacion': 'Producto descontado',
                    'his_cantidad': cantidad_a_descontar,
                    'his_observacion': 'Producto descontado',
                    'his_cliente': None,
                }
            else:
                return Response({'estado': False, 'mensaje': 'Stock insuficiente para realizar el descuento.'})
            historial_serializer = HistorialSerializer(data=historial_data)
            if historial_serializer.is_valid():
                historial_serializer.save()
                return Response({'estado': True, 'mensaje': f'Se agregaron {cantidad_a_descontar} unidades al producto.'})
            
        except Productos.DoesNotExist:
            return Response({'estado': False, 'mensaje': 'Producto no encontrado'})

    return Response({'estado': False, 'mensaje': 'Método no permitido'})


@api_view(["POST"])
def Agregar_Stock(request):
    if request.method == "POST":
        producto_id = request.data.get("producto_id")
        cantidad_a_agregar = request.data.get("cantidad_a_agregar")
        usu_id = request.data.get("usu_id")
        if cantidad_a_agregar is None:
            return Response({'estado': False, 'mensaje': 'Cantidad a agregar no especificada'})

        try:
            producto = Productos.objects.get(pro_id=producto_id)
            producto.pro_stock = int(producto.pro_stock)
            cantidad_a_agregar = int(cantidad_a_agregar)
            producto.pro_stock += cantidad_a_agregar
            producto.save()

            historial_data = {
                'his_usuario': usu_id,
                'his_producto': producto_id,
                'his_fecha_modificacion': datetime.now(),
                'his_modificacion': 'Producto agregado',
                'his_cantidad': cantidad_a_agregar,
                'his_observacion': 'Producto agregado',
                'his_cliente': None,
            }
            historial_serializer = HistorialSerializer(data=historial_data)
            if historial_serializer.is_valid():
                historial_serializer.save()
                return Response({'estado': True, 'mensaje': f'Se agregaron {cantidad_a_agregar} unidades al producto.'})
            else:
                return Response({'estado': False, 'mensaje': 'Error al agregar historial'})

        except Productos.DoesNotExist:
            return Response({'estado': False, 'mensaje': 'Producto no encontrado'})

    return Response({'estado': False, 'mensaje': 'Método no permitido'})


@api_view(["POST"])
def Modificar_Producto(request):
    if request.method == "POST":
        producto_id = request.data.get("producto_id")
        nuevo_nombre = request.data.get("nuevo_nombre")
        mar_id  = int(request.data.get("nueva_marca"))
        nuevo_stock = request.data.get("nuevo_stock")
        nuevo_precio = request.data.get("nuevo_precio")
        nuevo_estado = request.data.get("nuevo_estado")
        print(request.data)
        try:

            producto = Productos.objects.get(pro_id=producto_id)
            mensaje="Ingresa producto"
            if producto.pro_stock == nuevo_stock:
                pro_s=0
            else:
                if producto.pro_stock > nuevo_stock:
                    mensaje="Producto Modificado menos"
                    pro_s=producto.pro_stock-nuevo_stock
                else:
                    mensaje="Producto Modificado más"
                    pro_s=nuevo_stock-producto.pro_stock

            producto.pro_nombre = nuevo_nombre
            producto.pro_stock = nuevo_stock
            producto.pro_precio = nuevo_precio
            marca_instancia = Marcas.objects.get(mar_id=mar_id)
            producto.pro_marca = marca_instancia
            if nuevo_estado:
                producto.pro_estado = int(nuevo_estado)
            producto.save()

            historial_data = {
                'his_usuario':request.data["usu_id"] ,
                'his_producto': producto_id,
                'his_fecha_modificacion': datetime.now(),
                'his_modificacion': mensaje,
                'his_cantidad': pro_s,
                'his_observacion': 'Producto se modifica en el sistema',
                'his_cliente': None,
            }
            historial_serializer = HistorialSerializer(data=historial_data)

            if historial_serializer.is_valid():
                historial_serializer.save()
                return Response({'estado': True, 'mensaje': f'Se agrego un producto nuevo.'})
            return Response({'estado': True, 'mensaje': 'Producto modificado exitosamente.'})
        except Productos.DoesNotExist:
            return Response({'estado': False, 'mensaje': 'Producto no encontrado'})

    return Response({'estado': False, 'mensaje': 'Método no permitido'})


@api_view(["POST"])
def Agregar_Producto(request):
    if request.method == "POST":
        print(request.data)
        serializer = ProductoSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            pro=Productos.objects.values('pro_id').order_by('-pro_id').first()


            historial_data = {
                'his_usuario':request.data["usu_id"] ,
                'his_producto': pro["pro_id"],
                'his_fecha_modificacion': datetime.now(),
                'his_modificacion': 'Producto Ingresado',
                'his_cantidad': request.data["pro_stock"],
                'his_observacion': 'Producto se ingresa a sistema',
                'his_cliente': None,
            }
            historial_serializer = HistorialSerializer(data=historial_data)
            if historial_serializer.is_valid():
                historial_serializer.save()
                return Response({'estado': True, 'mensaje': f'Se agrego un producto nuevo.'})
            return Response({'estado': True, 'mensaje': 'Producto agregado con éxito'})
        return Response({'estado': False, 'mensaje': 'Datos no válidos'})
    return Response({'estado': False, 'mensaje': 'Método no permitido'})


@api_view(["GET"])
def Obtener_Marcas(request):
    if request.method == "GET":
        marcas = Marcas.objects.all()
        serializer = MarcaSerializer(marcas, many=True)
        return Response({'estado': True, 'marcas': serializer.data})
    return Response({'estado': False, 'mensaje': 'Método no permitido'})


@api_view(["GET"])
def Obtener_Proveedores(request):
    if request.method == "GET":
        proveedores = Proveedores.objects.all()
        serializer = ProveedorSerializer(proveedores, many=True)
        return Response({'estado': True, 'proveedores': serializer.data})
    return Response({'estado': False, 'mensaje': 'Método no permitido'})

@api_view(["GET"])
def obtener_historial_agregan(request):
    if request.method == "GET":
        resultados = Historial.objects.filter(his_modificacion='Producto agregado') \
            .values('his_producto__pro_nombre') \
            .annotate(producto=F('his_producto__pro_nombre'), total=Coalesce(Sum('his_cantidad'), 0)) \
            .values('producto', 'total')
        return Response({'estado': True, 'data': resultados})
    return Response({'estado': False, 'mensaje': 'Método no permitido'})


@api_view(["GET"])
def obtener_historial_agregan_pesos(request):
    if request.method == "GET":
        resultados = Historial.objects.filter(his_modificacion='Producto agregado') \
            .values('his_producto__pro_nombre') \
            .annotate(producto=F('his_producto__pro_nombre'), cantidad=Coalesce(Sum('his_cantidad'), 0), precio=F('his_producto__pro_precio')) \
            .values('producto', 'cantidad', 'precio')
        if resultados:
            return Response({'estado': True, 'data': resultados})
    return Response({'estado': False, 'mensaje': 'Método no permitido'})


@api_view(["GET"])
def obtener_historial_descuentan(request):
    if request.method == "GET":

        pro=request.GET.get("producto")

        if pro:
            resultados = (
            Historial.objects.filter(his_modificacion='Producto descontado',his_producto=pro)
            .annotate(fecha=TruncDate('his_fecha_modificacion'))
            .values('fecha')
            .annotate(total=Coalesce(Sum('his_cantidad'), 0))
        )
        else:
            resultados = (
                Historial.objects.filter(his_modificacion='Producto descontado')
                .annotate(fecha=TruncDate('his_fecha_modificacion'))
                .values('fecha')
                .annotate(total=Coalesce(Sum('his_cantidad'), 0))
            )
        if resultados:
            return Response({'estado': True, 'data': resultados})
    
    return Response({'estado': False, 'mensaje': 'No se a descontado de este producto'})


@api_view(["POST"])
def Agregar_Marca(request):
    if request.method == "POST":
        mar_nombre = request.data.get('mar_nombre')
        if mar_nombre is not None:
            serializer = MarcaSerializer(data={'mar_nombre': mar_nombre})
            if serializer.is_valid():
                serializer.save()
                return Response({'estado': True, 'mensaje': 'Marca agregada con éxito'})
            else:
                print(serializer.errors)
        else:
            print("mar_nombre no presente en los datos de la solicitud")
        return Response({'estado': False, 'mensaje': 'Datos no válidos'})
    return Response({'estado': False, 'mensaje': 'Método no permitido'})

@api_view(["POST"])
def Agregar_Proveedor(request):
    if request.method == "POST":
        print(request.data)
        serializer = ProveedorSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'estado': True, 'mensaje': 'Marca agregada con éxito'})
        else:
            print(serializer.errors)
        return Response({'estado': False, 'mensaje': 'Datos no válidos'})
    return Response({'estado': False, 'mensaje': 'Método no permitido'})



@api_view(["GET"])
def traer_rol(request):
    if request.method == "GET":
        rol = Roles.objects.values()
        return Response({'estado': True, 'data': rol})
    return Response({'estado': False, 'mensaje': 'Método no permitido'})

@api_view(["POST"])
def crear_usuario(request):
    if request.method == "POST":
        serializer = UsuarioSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'estado': True, 'mensaje': 'Usuario agregado con éxito'})
        return Response({'estado': False, 'mensaje': 'Datos no válidos'})
    return Response({'estado': False, 'mensaje': 'Método no permitido'})

@api_view(["GET"])
def Traer_usuarios_lista(request):
    if request.method == "GET":
        resultados = Usuarios.objects.values('usu_id','usu_nombre', "usu_apellido_p","usu_apellido_m","usu_rut", rol =F("usu_rol__rol_nombre")) 
        return Response({'estado': True, 'data': resultados})

    return Response({'estado': False, 'mensaje': 'Método no permitido'})

@api_view(["GET"])
def Traer_proveedores_lista(request):
    if request.method == "GET":
        resultados = Proveedores.objects.values() 
        return Response({'estado': True, 'data': resultados})

    return Response({'estado': False, 'mensaje': 'Método no permitido'})





@api_view(["GET"])
def traer_grafico(request):
    if request.method == "GET":
        resultados = Historial.objects.filter(his_modificacion__in=['Producto descontado', 'Producto agregado', 'Producto Ingresado']) \
            .values('his_fecha_modificacion', 'his_modificacion') \
            .annotate(total=Coalesce(Sum('his_cantidad'), 0))

        resultados = sorted(resultados, key=itemgetter('his_fecha_modificacion'))

        grouped_resultados = {fecha: list(group) for fecha, group in groupby(resultados, key=itemgetter('his_fecha_modificacion'))}

        final_resultados = []
        for fecha, group in grouped_resultados.items():
            entry = {'fecha': timezone.localtime(fecha).strftime('%Y-%m-%d')}
            for item in group:
                entry[item['his_modificacion']] = item['total']
            final_resultados.append(entry)
        return Response({'estado': True, 'data': final_resultados})
    return Response({'estado': False, 'mensaje': 'Método no permitido'})




@api_view(["POST"])
def Modificar_Usuario(request):
    if request.method == "POST":
        usu_id = request.data.get("usu_id")
        nuevo_nombre = request.data.get("nuevo_nombre")
        nuevo_apellido_p  = request.data.get("nuevo_apellido_p")
        nuevo_apellido_m = request.data.get("nuevo_apellido_m")
        nuevo_rut = request.data.get("nuevo_rut")
        nuevo_rol = request.data.get("nuevo_rol")
        nuevo_estado= request.data.get("nuevo_estado")
        try:
            usuario = Usuarios.objects.get(usu_id=usu_id)
            usuario.usu_nombre = nuevo_nombre
            usuario.usu_apellido_p = request.data["nueva_apellido_p"]
            usuario.usu_apellido_m = request.data["nueva_apellido_m"]
            usuario.usu_rut = nuevo_rut
            rol_instancia = Roles.objects.get(rol_id=nuevo_rol)

            if usuario.usu_rol.rol_id == 3 and usuario.usu_estado != int(nuevo_estado):
                return Response({ 'estado': False, 'mensaje': 'el usuario es tipo administrador no se cambiar el estado'})
            if nuevo_estado:
                usuario.usu_estado = int(nuevo_estado)
            usuario.usu_rol = rol_instancia
            usuario.save()

            return Response({'estado': True, 'mensaje': f'Se agrego un producto nuevo.'})
        except Productos.DoesNotExist:
            return Response({'estado': False, 'mensaje': 'Producto no encontrado'})

    return Response({'estado': False, 'mensaje': 'Método no permitido'})


@api_view(["POST"])
def Cambiar_Estado_Producto(request, pro_id):
    if request.method == "POST":
        nuevo_estado = 1 
        try:
            producto = Productos.objects.get(pro_id=pro_id)
            producto.pro_estado = nuevo_estado
            producto.save()
            serializer = ProductoSerializer(producto)
            return Response({'estado': True, 'mensaje': 'Estado del producto cambiado con éxito', 'nuevo_estado': serializer.data['pro_estado']})
        except Productos.DoesNotExist:
            return Response({'estado': False, 'mensaje': 'Producto no encontrado'})
    return Response({'estado': False, 'mensaje': 'Método no permitido'})




@api_view(["GET"])
def Traer_pro_historial(request):
    
    Productos = Historial.objects.filter(his_producto__pro_estado=1).values(id=F('his_producto'),nombre=F('his_producto__pro_nombre')).distinct()

    return Response({'estado': True, 'data': Productos})





@api_view(["GET"])
def poco_stock(request):
    productos=Productos.objects.filter(pro_stock__lt=20,pro_estado=1).values(producto=F('pro_nombre'),Stock=F('pro_stock'))
    if productos:
        return Response({'estado': True, 'data': productos})
    return Response({'estado': False, 'mensaje': "No hay productos con bajo stock"})


@api_view(["GET"])
def producto_provedor(request):
    pro=request.GET.get("producto")
    if pro:
        productos=Historial.objects.filter(his_producto__pro_estado=1,his_modificacion='Producto agregado',his_producto=pro) \
    .values(producto=F('his_producto__pro_proveedore__prov_nombre')).annotate(Stock=Sum('his_producto__pro_stock'))
    else:
        productos=Historial.objects.filter(his_producto__pro_estado=1,his_modificacion='Producto agregado') \
        .values(producto=F('his_producto__pro_proveedore__prov_nombre')).annotate(Stock=Sum('his_producto__pro_stock'))
    if productos:
        return Response({'estado': True, 'data': productos})
    return Response({'estado': False, 'mensaje': "No se han agregado del producto seleccionado"})





