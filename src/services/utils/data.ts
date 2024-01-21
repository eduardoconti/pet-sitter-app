export function formatData(dataString: Date | string) {
  const data = new Date(dataString);
  // Obtém os componentes da data
  const dia = data.getDate();
  const mes = data.getMonth() + 1; // Os meses começam do zero, então adicionamos 1
  const ano = data.getFullYear().toString().slice(-2); // Obtém os últimos dois dígitos do ano

  // Formata a data no formato "dd/mm/yy"
  return (
    dia.toString().padStart(2, "0") +
    "/" +
    mes.toString().padStart(2, "0") +
    "/" +
    ano
  );
}
