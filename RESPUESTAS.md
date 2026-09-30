## Fundamentos de Inteligencia Artificial aplicados al caso de negocio.

## Pregunta 1. 

La empresa desea utilizar un modelo de inteligencia artificial para identificar automaticamente las habilidades tecnicas del candidato a partir de su carta de presentacion y compararlas con las requeridas por la vacante. Explique como integraria esta capacidad a la solucion desarrollada.

## Respuesta: 

La integracion se realizaria mediante un modulo de servicio externo desacoplado que consuma un modelo de lenguaje. Al recibir la carta de presentacion y los requisitos de la vacante, se utilizaria un prompt estructurado con restricciones de salida en formato JSON. Para evitar bloqueos síncronos en el registro principal de la postulación, este proceso se ejecutaría de forma posterior o asíncrona, actualizando los metadatos de afinidad tecnica del candidato sin afectar la disponibilidad del flujo principal de la API.

## Pregunta 2. 

Suponga que el modelo de inteligencia artificial devuelve ocasionalmente una respuesta con formato invalido o habilidades que no existen en el catalogo de la empresa. Explique como deberia manejar esta situacion el backend.

## Respuesta:  
El backend debe aplicar programacion defensiva mediante validacion estricta de esquemas utilizando librerias de validacion. Si el JSON devuelto por la inteligencia artificial esta mal formado o corrupto, se implementaran reintentos controlados. Asimismo, las habilidades extraidas se filtraran comparandolas directamente contra una lista oficial o catalogo maestro almacenado en la base de datos de la empresa, descartando o ignorando cualquier termino fuera de dicho catalogo. Si el servicio de inteligencia artificial falla por completo, el sistema degradara la funcionalidad de manera elegante permitiendo que la postulacion se guarde unicamente con el motor de reglas deterministico.

## Pregunta 3. 

Considera apropiado reemplazar completamente las reglas deterministicas utilizadas para calcular la prioridad por una decision realizada por un modelo de inteligencia artificial, teniendo en cuenta que la decision afecta directamente a personas? Justifique tecnicamente su respuesta.

## Respuesta: 

No es apropiado reemplazar las reglas deterministicas por decisiones autonomas de un modelo de inteligencia artificial en procesos que afectan directamente a personas. Las razones tecnicas principales son la explicabilidad y la trazabilidad. Las reglas de negocio deterministicas permiten revisar o auditar con exactitud matematica por que un candidato obtuvo un puntaje especifico. Los modelos de inteligencia artificial actuan como sistemas probabilisticos opacos o cajas negras susceptibles a sesgos y variaciones de comportamiento, lo cual dificulta garantizar equidad y explicabilidad ante revisiones legales o reclamos de los candidatos. La inteligencia artificial debe funcionar unicamente como un apoyo analitico secundario, manteniendo el nucleo de priorizacion bajo un motor de reglas riguroso y transparente.