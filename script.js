document.addEventListener("DOMContentLoaded", () => {
    // 1. Array dei film (Titoli puliti, senza numeri)
    const netflixMovies = [
        "Il Grinch", "Gran Turismo", "Mamma ho perso l'aereo", "The Polar Express", 
        "Miracolo nella 24a strada", "Rush", "ELF", "Le Mans", 
        "The Santa Claus", "Race For Glory", "Vacanze di natale", "Attraverso i miei occhi", 
        "Mamma ho riperso l'aereo", "The seat", "A Christmas Carol", "Go-Kart", 
        "Una Poltrona per 2", "FANGIO - L'uomo che domava le macchine", "Rally for life", "Circuito Rovente",  
        "Qualcuno salvi il natale", "Baby Driver - Genio della fuga", "Senna", "Rally Brudar",
    ];

    // 🆕 ARRAY DEI POSTER (Per l'uso di immagini locali)
    const moviePosters = [
        "posters/1.png", "posters/2.png", "posters/3.png", "posters/4.png", 
        "posters/5.png", "posters/6.png", "posters/7.png", "posters/8.png", 
        "posters/9.png", "posters/10.png", "posters/11.png", "posters/12.png", 
        "posters/13.png", "posters/14.png", "posters/15.png", "posters/16.png", 
        "posters/17.png", "posters/18.png", "posters/19.png", // Giorno del Compleanno!
        "posters/20.png", "posters/21.png", "posters/22.png", "posters/23.png", 
        "posters/24.png", 
    ];

    // Array dei pensieri (omesso per brevità)
    const personalMessages = [
        "Oggi inizia la magia, spero che questo piccolo gesto ti porti un sorriso!", 
        "Un piccolo momento di relax solo per te, te lo meriti!", 
        "Ricorda sempre quanto sei speciale <3", 
        "Che questo film riscaldi la tua serata come un viaggio.", 
        "Goditi il suono delle risate che riempiono il cuore.", 
        "Sei la luce più bella di questo periodo, ma non solo!", 
        "Pensieri felici per una settimana che sta per iniziare!", 
        "Un piccolo promemoria: le cose migliori della vita crescono nel tempo", 
        "Non dimenticare di sognare, i sogni di Natale si avverano!", 
        "Spero che tu stia bene. Ti voglio bene!", 
        "Ecco una pausa per ricaricare le batterie. Sei fantastico!", 
        "Questa casella è piena di gratitudine per averti nella mia vita.", 
        "Che tu possa trovare gioia nelle piccole cose, oggi e sempre.", 
        "Fermati un attimo, respira e goditi la calma del Natale.", 
        "Un piccolo regalo di tempo per te, senza fretta.", 
        "Che questo film sia la coccola che aspettavi.", 
        "I regali migliori non sono materiali, ma sono i momenti che condividiamo.", 
        "Ti invio tanta energia positiva per la giornata!", 
        "🎁 TANTI AUGURI DI BUON COMPLEANNO! Oggi sei tu la star del giorno! 🎂", // Giorno 19 (Speciale!)
        "Il conto alla rovescia sta per finire, goditi ogni istante.", 
        "Siamo quasi arrivati! Spero ti sia piaciuto il viaggio.", 
        "Che la serenità del Natale ti scaldi il cuore.", 
        "Guarda avanti: domani sarà ancora più speciale.", 
        "È arrivata la Vigilia! Grazie per essere una persona meravigliosa. Buon Natale!", 
    ];

// 2. Elementi DOM e Data Corrente
    const doors = document.querySelectorAll(".door");
    const modal = document.getElementById("filmModal");
    const filmTitle = document.getElementById("filmTitle");
    const closeButton = document.querySelector(".close-button");
    const resetButton = document.getElementById('resetButton'); 

    const bellSound = new Audio("bell-chime.mp3"); 
    bellSound.volume = 0.6; 

    const currentDate = new Date();
    const currentDay = currentDate.getDate();
    // 11 = Dicembre. Indice base zero.
    const currentMonth = currentDate.getMonth(); 

    const STORAGE_KEY = 'adventCalendarState';

    // Funzioni per il Modale
    const showModal = (title) => {
        filmTitle.textContent = title;
        modal.style.display = "block";
    };

    const closeModal = () => {
        modal.style.display = "none";
    };

    // 💾 Funzione di Salvataggio (Mantiene traccia del click, ma non è usata per l'apertura forzata)
    const saveState = (day) => {
        // NON salvare lo stato se non è Dicembre
        if (currentMonth !== 11) {
            return;
        }

        const savedState = localStorage.getItem(STORAGE_KEY);
        let openedDays = savedState ? JSON.parse(savedState) : [];

        if (!openedDays.includes(day)) {
            openedDays.push(day);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(openedDays));
        }
    };

    /**
     * CORREZIONE: Carica lo stato forzando l'apertura di tutte le caselle 
     * disponibili (fino al giorno corrente) a Dicembre.
     */
    const loadState = () => {
        // La logica di apertura e persistenza deve avvenire SOLO a Dicembre (Mese 11)
        if (currentMonth !== 11) {
            return;
        }
        
        // Forza l'apertura di tutte le caselle il cui giorno è inferiore o uguale al giorno corrente
        for (let day = 1; day <= currentDay; day++) {
            if (day >= 1 && day <= 24) {
                const door = document.querySelector(`.door[data-day="${day}"]`);
                if (door) {
                    // Applica 'open' alle caselle disponibili, garantendo la persistenza
                    door.classList.add('open');
                }
            }
        }
    };

    loadState(); // Chiama la funzione di caricamento all'avvio
    
    // ----------------------------

    // 3. Aggiungi i gestori di eventi a tutte le finestrelle
    doors.forEach((door) => {
        door.addEventListener("click", () => {
            const day = parseInt(door.dataset.day); // Numero del giorno della finestrella

            // Se la porta è GIA' aperta, ignora il click
            if (door.classList.contains("open")) {
                // Se è già aperta, permetti solo di vedere il modale senza cambiare lo stato
                const movie = netflixMovies[day - 1] || "Film di Natale a sorpresa!";
                showModal(movie);
                return; 
            }

            // 🌟 LOGICA DI CONTROLLO DEL MESE E DEL GIORNO 🌟
            let isClickAllowed = false;
            
            // 🎄 MESE DI DICEMBRE (Modalità Avvento)
            if (currentMonth === 11) {
                // L'apertura è consentita solo se il numero della casella è <= al giorno corrente
                const isAvailable = day <= currentDay;
                if (isAvailable && day >= 1 && day <= 24) {
                    isClickAllowed = true;
                }
            }
            // Blocco totale per Novembre (10) e altri mesi.

            if (!isClickAllowed) {
                // Messaggio corretto per qualsiasi tentativo di apertura fuori tempo
                alert("Questa casella può essere aperta solo a Dicembre, a partire dal giorno " + day + ".");
                return;
            }

            // --- Logica di Apertura ---
            
            // 4. Apri la porta
            door.classList.add("open");

            // 5. Salva lo stato di apertura (salvataggio opzionale)
            saveState(day); 

            // Riproduci il suono dei campanelli
            bellSound.currentTime = 0; 
            bellSound.play();

            // 6. Mostra il film associato
            const movie = netflixMovies[day - 1] || "Film di Natale a sorpresa!";
            showModal(movie);
        });
    });

    // 7. Gestione chiusura modale
    closeButton.addEventListener("click", closeModal);

    // Chiudi il modale cliccando fuori
    window.addEventListener("click", (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

    // 8. Logica per il pulsante di RESET
    if (resetButton) {
        resetButton.addEventListener('click', () => {
            if (confirm("Sei sicuro di voler resettare il calendario? Tutte le caselle aperte verranno chiuse.")) {
                // Rimuove lo stato salvato. loadState() si occuperà poi di riaprire i giorni disponibili.
                localStorage.removeItem(STORAGE_KEY);
                window.location.reload(); 
            }
        });
    }
});