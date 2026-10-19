// La consulta se delega sin conocer el almacenamiento utilizado.
export function listUsers(userRepository) {
  return { ok: true, users: userRepository.findAll() };
}
