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
        "posters/17.png", "posters/18.png", "posters/19.png", // Giorno del Compleanno
        "posters/20.png", "posters/21.png", "posters/22.png", "posters/23.png", 
        "posters/24.png", 
    ];

    // Array dei pensieri
    const personalMessages = [
        "Oggi inizia la magia, spero che questo piccolo gesto ti porti un sorriso!", // Giorno 1
        "Un piccolo momento di relax solo per te, te lo meriti!", // Giorno 2
        "Ricorda sempre quanto sei speciale <3", // Giorno 3
        "Che questo film riscaldi la tua serata come un viaggio.", // Giorno 4
        "Goditi il suono delle risate che riempiono il cuore.", // Giorno 5
        "Sei la luce più bella di questo periodo, ma non solo!", // Giorno 6
        "Pensieri felici per una settimana che sta per iniziare!", // Giorno 7
        "Un piccolo promemoria: le cose migliori della vita crescono nel tempo", // Giorno 8
        "Non dimenticare di sognare, i sogni di Natale si avverano!", // Giorno 9
        "Spero che tu stia bene. Ti voglio bene!", // Giorno 10
        "Ecco una pausa per ricaricare le batterie. Sei fantastico!", // Giorno 11
        "Questa casella è piena di gratitudine per averti nella mia vita.", // Giorno 12
        "Che tu possa trovare gioia nelle piccole cose, oggi e sempre.", // Giorno 13
        "Fermati un attimo, respira e goditi la calma del Natale.", // Giorno 14
        "Un piccolo regalo di tempo per te, senza fretta.", // Giorno 15
        "Che questo film sia la coccola che aspettavi.", // Giorno 16
        "I regali migliori non sono materiali, ma sono i momenti che condividiamo.", // Giorno 17
        "Ti invio tanta energia positiva per la giornata!", // Giorno 18
        "🎁 TANTI AUGURI DI BUON COMPLEANNO! Oggi sei tu la star del giorno! 🎂", // Giorno 19 (Speciale!)
        "Il conto alla rovescia sta per finire, goditi ogni istante.", // Giorno 20
        "Siamo quasi arrivati! Spero ti sia piaciuto il viaggio.", // Giorno 21
        "Che la serenità del Natale ti scaldi il cuore.", // Giorno 22
        "Guarda avanti: domani sarà ancora più speciale.", // Giorno 23
        "È arrivata la Vigilia! Grazie per essere una persona meravigliosa. Buon Natale!", // Giorno 24
    ];

    // 2. Elementi DOM e Data Corrente
    const doors = document.querySelectorAll(".door");
    const modal = document.getElementById("filmModal");
    const filmTitle = document.getElementById("filmTitle");
    const personalMessageElement = document.getElementById("personalMessage"); 
    const closeButton = document.querySelector(".close-button");
    const resetButton = document.getElementById('resetButton'); 
    const filmPoster = document.getElementById("filmPoster"); 

    // Audio - Se non funziona il WAV, è necessario convertirlo in MP3!
    const bellSound = new Audio("mixkit-bell-of-promise-930.wav"); 
    bellSound.volume = 0.6; 
    const birthdaySound = new Audio("happy-birthday.mp3");
    birthdaySound.volume = 0.8; 

    const currentDate = new Date();
    const currentDay = currentDate.getDate();
    const currentMonth = currentDate.getMonth(); 

    const STORAGE_KEY = 'adventCalendarState';

    // Funzioni Modale
    const showModal = (title, message, posterUrl) => {
        filmTitle.textContent = title;
        personalMessageElement.textContent = message; 
        filmPoster.src = posterUrl;
        filmPoster.alt = `Poster del film: ${title}`;
        modal.style.display = "block";
    };

    const closeModal = () => {
        birthdaySound.pause();
        birthdaySound.currentTime = 0;
        modal.style.display = "none";
        filmPoster.src = "";
        filmPoster.alt = ""; 
    };

    // Funzioni di Persistenza dello Stato (localStorage)
    const saveState = (day) => {
        if (currentMonth !== 11) { return; }
        const savedState = localStorage.getItem(STORAGE_KEY);
        let openedDays = savedState ? JSON.parse(savedState) : [];
        if (!openedDays.includes(day)) {
            openedDays.push(day);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(openedDays));
        }
    };

    const loadState = () => {
        if (currentMonth !== 11) { return; } 
        
        const savedState = localStorage.getItem(STORAGE_KEY);
        if (savedState) {
            const openedDays = JSON.parse(savedState);
            openedDays.forEach(day => {
                const door = document.querySelector(`.door[data-day="${day}"]`);
                if (door) { 
                    // Carica lo stato di "già aperta" senza applicare l'effetto visivo 'open'
                    door.classList.add('opened-state'); 
                }
            });
        }
    };

    loadState(); 
    
    // ----------------------------

    // 3. Aggiungi i gestori di eventi a tutte le finestrelle
    doors.forEach((door) => {
        // Al caricamento, assicurati che le caselle 'opened-state' non abbiano l'effetto visivo 'open'
        if (door.classList.contains('opened-state')) {
             door.classList.remove('open');
        }

        door.addEventListener("click", () => {
            const day = parseInt(door.dataset.day);

            const isAlreadyOpened = door.classList.contains("opened-state");
            
            // Logica di controllo della data (solo se non è già stata aperta in precedenza)
            let isClickAllowed = false;
            
            if (currentMonth === 10) { // Modalità Test
                if (day >= 1 && day <= 24) { isClickAllowed = true; }
            } 
            else if (currentMonth === 11) { // Modalità Avvento
                const isAvailable = day <= currentDay;
                if (isAvailable && day >= 1 && day <= 24) { isClickAllowed = true; }
            } 

            // Blocca il click solo se NON è permesso DALLA DATA E NON è MAI stata aperta
            if (!isClickAllowed && !isAlreadyOpened) { 
                if (currentMonth === 11) {
                    alert("Questa casella può essere aperta solo il giorno " + day + " di Dicembre, o in un giorno successivo.");
                } else if (currentMonth === 10) {
                     alert("Questa casella non fa parte dell'Avvento (1-24).");
                } else {
                    alert("Il calendario è bloccato. Torna a Dicembre per l'Avvento o a Novembre per il test!");
                }
                return;
            }

            // --- Logica di Apertura/Visualizzazione ---
            
            // Passo 1: Aggiungi la classe 'open' per l'effetto visivo (carta girata)
            door.classList.add("open"); 

            // Passo 2: Logica Audio (ENTRAMBI I SUONI FUNZIONANO SEMPRE AL CLICK)
            // L'audio viene riprodotto in modo coerente ad ogni interazione.
            if (day === 19) {
                birthdaySound.currentTime = 0; 
                birthdaySound.play();
            } else {
                bellSound.currentTime = 0; 
                bellSound.play(); 
            }

            // Passo 3: Logica di Salvataggio (solo se non è la prima apertura del giorno)
            if (!isAlreadyOpened) {
                saveState(day); 
                door.classList.add('opened-state'); // Marca come visitata per i futuri caricamenti
            } 
            
            // Passo 4: Mostra il popup
            const movie = netflixMovies[day - 1] || "Film di Natale a sorpresa!";
            const message = personalMessages[day - 1] || "Un augurio speciale per te!";
            const posterUrl = moviePosters[day - 1] || "posters/default.png";

            showModal(movie, message, posterUrl); 
        });
    });

    // Gestione chiusura modale
    closeButton.addEventListener("click", closeModal);
    window.addEventListener("click", (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

    // Logica per il pulsante di RESET
    if (resetButton) {
        resetButton.addEventListener('click', () => {
            if (confirm("Sei sicuro di voler resettare il calendario? Tutte le caselle aperte verranno chiuse.")) {
                localStorage.removeItem(STORAGE_KEY);
                window.location.reload(); 
            }
        });
    }
});
