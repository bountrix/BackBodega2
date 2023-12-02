from django.db import models


class Clientes(models.Model):
    cli_id = models.BigAutoField(primary_key=True)
    cli_nombre = models.TextField(blank=True, null=True)
    cli_direccion = models.TextField(blank=True, null=True)
    cli_telefono = models.BigIntegerField(blank=True, null=True)
    cli_correo = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'Clientes'


class Proveedores(models.Model):
    prov_id = models.BigAutoField(primary_key=True)
    prov_nombre = models.TextField(blank=True, null=True)
    prov_contacto = models.TextField(blank=True, null=True)
    prov_telefono = models.BigIntegerField(blank=True, null=True)
    prov_correo = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'Proveedores'


class Historial(models.Model):
    his_id = models.BigAutoField(primary_key=True)
    his_fecha_modificacion = models.DateTimeField(blank=True, null=True)
    his_modificacion = models.TextField(blank=True, null=True)
    his_cantidad = models.BigIntegerField(blank=True, null=True)
    his_observacion = models.TextField(blank=True, null=True)
    his_cliente = models.BigIntegerField(blank=True, null=True)
    his_producto = models.ForeignKey('Productos', models.DO_NOTHING, db_column='his_producto', blank=True, null=True)
    his_usuario = models.BigIntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'historial'


class Marcas(models.Model):
    mar_id = models.BigAutoField(primary_key=True)
    mar_nombre = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'marcas'


class Productos(models.Model):
    pro_id = models.BigAutoField(primary_key=True)
    pro_nombre = models.TextField(blank=True, null=True)
    pro_stock = models.BigIntegerField(blank=True, null=True)
    pro_registro = models.DateTimeField(blank=True, null=True)
    pro_fecha_vencimiento = models.DateField(blank=True, null=True)
    pro_precio = models.BigIntegerField(blank=True, null=True)
    pro_descripcion = models.TextField(blank=True, null=True)
    pro_marca =  models.ForeignKey(Marcas, models.DO_NOTHING, db_column='pro_marca', blank=True, null=True)
    pro_proveedore =  models.ForeignKey('Proveedores', models.DO_NOTHING, db_column='pro_proveedore', blank=True, null=True)
    pro_estado = models.BigIntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'productos'


class Roles(models.Model):
    rol_id = models.BigAutoField(primary_key=True)
    rol_nombre = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'roles'


class Usuarios(models.Model):
    usu_id = models.BigAutoField(primary_key=True)
    usu_nombre = models.TextField(blank=True, null=True)
    usu_apellido_p = models.TextField(blank=True, null=True)
    usu_apellido_m = models.TextField(blank=True, null=True)
    usu_rut = models.TextField(blank=True, null=True)
    usu_password = models.TextField(blank=True, null=True)
    usu_rol = models.ForeignKey(Roles, models.DO_NOTHING, db_column='usu_rol', blank=True, null=True)
    usu_estado = models.BigIntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'usuarios'