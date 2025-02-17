 const dodajTermin = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!selectedDate) {
      alert("Izberite datum.");
      return;
    }

    if (startTime >= endTime) {
      alert("Konec termina mora biti po začetku termina.");
      return;
    }

    // Handle different cases based on 'namen'
    if (namen === "prostiTermin") {

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/termini`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newTermin),
          }
        );

      if (!response.ok) {
        throw new Error("Napaka pri dodajanju termina.");
      }

        setTermini((prev) => [...prev, newTermin]);

      } catch (error) {
        alert(error);
        return;
      }

  // Dodajanje stranke
  } else if (namen === "stranka") {
    // Check if all required client fields are filled
    if (!ime || !telefon || !email || selectedServices.length === 0) {
      alert("Izpolnite vsa polja in izberite vsaj eno storitev.");
      return;
    }

    const narocilo: ClientTermin = {
      ime,
      telefon,
      email,
      datum: selectedDate,
      startTime,
      endTime,
      cena: cena || 0,
      storitve: selectedServices,
    };
    console.log("Narocilo", narocilo)
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/narocila`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(narocilo),
        }
      );

      if (!response.ok) {
        throw new Error("Napaka pri dodajanju termina za stranko.");
      }
      const data = await response.json();
      console.log(data)
      setClientTermin((prev) => [...prev, narocilo as ClientTermin]);
    } catch (error) {
      alert(error);
      return;
    }
  }

    // Reset form state after submission
    setOpenForm(false);
    setNamen("");
    setStartTime("");
    setEndTime("");
    setName("");
    setTel("");
    setMail("");
    setSelectedServices([]);
    setCena(0);
    setTime(0);
};