import Link from "next/link";

// make hoe page to load children 
export default function Home() {
  return (
    <div>
        <h1>AsistenciApp</h1>
        <div className="flex flex-col gap-4 card">
          <h2>¿Eres alumno?</h2>
          <p>Abre el enlace que te ha pasado tu profesor en la clase. Necesitarás también el código de 4 cifras que verás en su pantalla.</p>
        </div>
        <div className="flex flex-col gap-4 card">
          <h2>¿Eres el profesor?</h2>
          <p>Abre el enlace de tu panel. Aparece en la terminal al arrancar la app con python app.py --tunel.</p>
        </div>
    </div>
  );
}
