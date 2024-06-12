import { format, parseISO } from "date-fns";

const calcular_paginacion = (pag,limit,length)=>{
    var skip = (pag - 1) * limit;
    let To = skip + limit
    let From = skip + 1
    let prev_page_url = null
    let first_page_url = `/?page=${pag}`
    let next_page_url = null
    let last_page=Math.ceil(length / limit)

    if(pag > 1) prev_page_url = `/?page=${pag-1}`
    if(last_page>pag) next_page_url = `/?page=${pag+1}`
    else To = length

    
    const links:Array<{label: string; active: boolean; url: string | null; page: number | null}> = []
    for(let i = 0; i<last_page; i++){
      if(i===0){
        if(pag === 1){
          links.push({
            "url": null,
            "label": "&laquo; Previous",
            "active": false,
            "page": null
          })
        }else{
          links.push({
            "url": prev_page_url,
            "label": "&laquo; Previous",
            "active": false,
            "page": i+1
          })
        }
        links.push({
          "url": `/?page=${i+1}`,
          "label": String(i+1),
          "active": (i+1)===pag?true:false,
          "page": i+1
        })
      }else if (i===(last_page-1)){
        links.push({
          "url": `/?page=${i+1}`,
          "label": String(i+1),
          "active": i+1===pag?true:false,
          "page": i+1
        })
        links.push({
          "url": next_page_url,
          "label": "Next &raquo;",
          "active": false,
          "page": Number(pag+1)
        })
      }else{
        links.push({
          "url": `/?page=${i+1}`,
          "label": String(i+1),
          "active": i+1===pag?true:false,
          "page": i+1
        })
      }
      

    }

    return {
        To,
        From,
        prev_page_url,
        first_page_url,
        next_page_url,
        last_page,
        links

    }
  }

  const diferenciaDeFecha = (actual,fecha1)=>{
    const diferenciaEnMilisegundos: number = actual.getTime() - fecha1.getTime();
    const diferenciaEnMinutos: number = diferenciaEnMilisegundos / (1000 * 60);
    let conexionData  = ""
    if(diferenciaEnMinutos<60){
      conexionData = `Hace ${Math.floor(diferenciaEnMinutos)} min`
    }else{
      const diferenciaEnHoras: number = diferenciaEnMinutos / (60);
      if(diferenciaEnHoras <= 24){
        conexionData = `Hace ${Math.floor(diferenciaEnHoras)} hrs`
      }else{
        const diferenciaEnDias: number = diferenciaEnHoras / (24);
        conexionData = `Hace ${Math.floor(diferenciaEnDias)} dias`
      }
    }

    return conexionData
  }

  const formatearFechaYHora = (fecha: Date | string)=>{
    const fechaString = typeof fecha === 'string' ? fecha : fecha.toISOString();
    const fechaFormateada = format(new Date(fechaString), 'dd LLL yyyy, hh:mm a');
    return fechaFormateada;
  }
  
  
  module.exports = {
    calcular_paginacion,
    diferenciaDeFecha,
    formatearFechaYHora 
  } 