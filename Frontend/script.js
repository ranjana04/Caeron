    // Dark mode toggle with saved preference
    const toggleBtn = document.querySelector('.toggle-btn');
    function toggleDarkMode() {
      document.body.classList.toggle('dark');
      if (document.body.classList.contains('dark')) {
        localStorage.setItem('darkMode', 'enabled');
      } else {
        localStorage.setItem('darkMode', 'disabled');
      }
    }
    // Load saved dark mode preference
    if (localStorage.getItem('darkMode') === 'enabled') {
      document.body.classList.add('dark');
    }

    // Show page function
    function showPage(pageId) {
      window.pageId = pageId;
      document.querySelectorAll('.page').forEach(p => {
        p.classList.remove('active');
      });
      const page = document.getElementById(pageId);
      if((pageId !== 'search' && pageId !== 'register' && pageId != 'home') && !Boolean(sessionStorage.getItem("token"))){
         openAuthModal();
      }else if (page) {
        page.classList.add('active');
        if (pageId === 'search') {
          initMap();
        }
      }
    }

     window.onload = function () {
    showPage('home');
  };

    const validateSession = async (token=null)=>{
      let prevToken = token ?? sessionStorage.getItem("token");
      const res = await callApi('http://localhost:3000/api/auth/me', {token:prevToken}, "POST")

      if(!res.success){
        sessionStorage.removeItem("token");
      }
    }

    const callApi = async (url, data = {}, method = "GET") => {

      let skipList = ["login", 'signup', 'me'];

      let endPoint = url.split("/");
      endPoint = endPoint[endPoint.length-1];

      if(!skipList.includes(endPoint)){
        await validateSession();
      }

      const response = method !== 'GET' ? await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          "authorization" : sessionStorage.getItem("token")
        },
        body: JSON.stringify(data)
      }) : await fetch(url);

      const result = await response.json();
      console.log("Api res:", result);
      return result;
    }

    // Register form handler (mock)
    const form = document.getElementById('registerForm');
    form.addEventListener('submit', async e => {

      e.preventDefault();

      let url = "http://localhost:3000/api/register/"

      const formData = new FormData(form);
      const name = formData.get('name');
      const speciality = formData.get('speciality');
      const location = formData.get('location');
      const role = formData.get('role');

      const requestData = { name: name, speciality: speciality, address: location }

      const result = await callApi(url + role, requestData, "POST");

      if (result.success) {
         alert(`${role.charAt(0).toUpperCase() + role.slice(1)} registered successfully!`);
      } else {
        alert("Registration failed: " + (result.message || "Please try again."));
     }

     e.target.reset();
});

    // Appointment page - fill doctor/hospital dropdown dynamically
    // const registeredEntities = [
    //   { id: 1, name: 'Dr. Rajesh Sharma', role: 'doctor' },
    //   { id: 2, name: 'City Care Hospital', role: 'hospital' },
    //   { id: 3, name: 'Dr. Anjali Mehta', role: 'doctor' },
    //   { id: 4, name: 'Green Valley Hospital', role: 'hospital' }
    // ];


    // function fillAppointmentDoctors() {
    //   const select = document.getElementById('appointmentDoctor');
    //   select.innerHTML = '';
    //   registeredEntities.forEach(ent => {
    //     const opt = document.createElement('option');
    //     opt.value = ent.id;
    //     opt.textContent = `${ent.name} (${ent.role})`;
    //     select.appendChild(opt);
    //   });
    // }
    // fillAppointmentDoctors();


    document.addEventListener('DOMContentLoaded', () => {
  populateDoctorHospitalDropdown();
});

async function populateDoctorHospitalDropdown() {
  const select = document.getElementById("appointmentDoctor");
  select.innerHTML = `<option value="">-- Select Doctor or Hospital --</option>`;

  try {
    const [doctorsRes, hospitalsRes] = await Promise.all([
      fetch("http://localhost:3000/api/register/doctors"),
      fetch("http://localhost:3000/api/register/hospitals"),
    ]);

    const doctorsData = await doctorsRes.json();
    const hospitalsData = await hospitalsRes.json();

    doctorsData.data.forEach(doc => {
      const option = document.createElement("option");
      option.value = `${doc._id}|doctor`;
      option.textContent = `Dr. ${doc.name} (${doc.speciality})`;
      select.appendChild(option);
    });

    hospitalsData.data.forEach(hosp => {
      const option = document.createElement("option");
      option.value = `${hosp._id}|hospital`;
      option.textContent = `🏥 ${hosp.name}`;
      select.appendChild(option);
    });

  } catch (error) {
    console.error("Error loading doctor/hospital list:", error);
  }
}


    // Appointment form handler (mock)
    document.getElementById("appointmentForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const fullName = document.getElementById("appointmentName").value;
  const [doctorOrHospitalId, role] = document.getElementById("appointmentDoctor").value.split("|");
  const dateTime = document.getElementById("appointmentDate").value;

  try {
    const result = await callApi("http://localhost:3000/api/appointments", {
      fullName,
      doctorOrHospitalId,
      role,
      dateTime,
    }, "POST");

    if (result.success) {
      alert("Appointment booked successfully!");
      this.reset();
    } else {
      alert("Failed to book appointment: " + result.message);
    }
  } catch (err) {
    console.error(err);
    alert("Error booking appointment.");
  }
});


    // Medicine form handler (mock)
  const formMedicine = document.getElementById('medicineForm');

formMedicine.addEventListener('submit', async (e) => {
  e.preventDefault();

  const data = new FormData(formMedicine);
  const medicineName = data.get('medicineName')?.trim();
  const quantity = parseInt(data.get('quantity'), 10);
  const address = data.get('address')?.trim();


  if (!medicineName || isNaN(quantity) || !address) {
    alert("Please fill in all fields correctly.");
    return;
  }

  const requestData = { medicineName, quantity, address };

  const result = await callApi('http://localhost:3000/api/medicine', requestData, "POST");

  if (result.success) {
    alert(result.message);
    e.target.reset();
  } else {
    alert("Failed to order medicine: " + result.message);
  }
});



    // Ambulance form handler (mock)
    document.getElementById('ambulanceForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const data = new FormData(e.target);
  const name = data.get('ambulanceName')?.trim(); // optional for backend
  const location = data.get('ambulanceLocation')?.trim();
  const contactNumber = data.get('contactNumber')?.trim();

  const phoneRegex = /^\d{10}$/; 

   if (!phoneRegex.test(contactNumber)) {
    alert("Please enter a valid 10-digit contact number.");
    return;
  }
  // You can optionally send the name as emergencyDetails or ignore it
  const requestData = { location, contactNumber, emergencyDetails: name };

  try {
    const result = await callApi('http://localhost:3000/api/ambulance', requestData, "POST");

    if (result.success) {
      alert("Ambulance requested successfully!");
      e.target.reset();
    } else {
      alert("Failed to request ambulance: " + result.message);
    }
  } catch (error) {
    console.error(error);
    alert("Server error while requesting ambulance.");
  }
});





//search form 
   let map;
let markers = [];

function initMap(lat = 21.2514, lng = 81.6296) { // Raipur or default
  map = L.map('map').setView([lat, lng], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);
  map.invalidateSize();

}

function clearMarkers() {
  markers.forEach(m => map.removeLayer(m));
  markers = [];
  document.getElementById('doctorList').innerHTML = '';
}

function displayResults(centerLat, centerLng, doctors, hospitals) {
  clearMarkers();
  map.setView([centerLat, centerLng], 13);

  const userMarker = L.marker([centerLat, centerLng]).addTo(map);
  userMarker.bindPopup("Your location").openPopup();
  markers.push(userMarker);

  const list = document.getElementById("doctorList");

  [...doctors, ...hospitals].forEach(entity => {
    const [lng, lat] = entity.location.coordinates;
    const marker = L.marker([lat, lng]).addTo(map);
    marker.bindPopup(`<strong>${entity.name}</strong><br>${entity.speciality || entity.address}`);
    markers.push(marker);

    const li = document.createElement("li");
    li.textContent = `${entity.name} (${entity.speciality || "Hospital"})`;
    li.addEventListener("click", () => {
      map.setView([lat, lng], 15);
      marker.openPopup();
    });
    list.appendChild(li);
  });

  // Force Leaflet to recalc map size and refresh rendering
  setTimeout(() => {
    map.invalidateSize();
  }, 200);
}


async function performSearch(locationText) {
  if (!locationText.trim()) {
    alert("Please enter a location.");
    return;
  }

  try {
    console.log("➡ Searching for:", locationText);

    const searchUrl = `http://localhost:3000/api/search?address=${encodeURIComponent(locationText)}`;
    const data = await callApi(searchUrl, {}, "GET");


    if (data.doctors.length === 0 && data.hospitals.length === 0) {
      alert("No nearby results found.");
      return;
    }

    
    const geoUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(locationText)}&format=json&limit=1`;

    const geoRes = await fetch(geoUrl, {
      headers: {
        "User-Agent": "CaeronApp/1.0 (ranjana@example.com)", 
        "Accept-Language": "en-US"
      }
    });

    const geoData = await geoRes.json();

    if (!geoData.length) {
      alert("Could not find coordinates for this location.");
      return;
    }

    const lat = parseFloat(geoData[0].lat);
    const lng = parseFloat(geoData[0].lon);

    console.log("GeoData:", geoData);
    console.log("Parsed lat/lng:", lat, lng);

    
    displayResults(lat, lng, data.doctors, data.hospitals);
  } catch (err) {
    console.error("Search Error:", err);
    alert("Error fetching results.");
  }
}



document.getElementById("searchBtn").addEventListener("click", () => {
  const locationInput = document.getElementById("searchLocation").value;
  performSearch(locationInput);
});

window.addEventListener("DOMContentLoaded", () => {
  initMap();
});



//authetication form


function openAuthModal(type) {
  document.getElementById("authModal").style.display = "block";
  toggleForm(type);
}

function closeAuthModal() {
  document.getElementById("authModal").style.display = "none";
}

function toggleForm(type) {
  const loginForm = document.getElementById("userLoginForm");
  const signupForm = document.getElementById("userSignupForm");
  const title = document.getElementById("authTitle");

  if (type === "login") {
    loginForm.style.display = "block";
    signupForm.style.display = "none";
    title.textContent = "Login";
  } else {
    loginForm.style.display = "none";
    signupForm.style.display = "block";
    title.textContent = "Sign Up";
  }
}

async function loginUser(event) {
  event.preventDefault();
  const email = document.getElementById("userEmail").value;
  const password = document.getElementById("userPassword").value;

  try {

    const res = await callApi("http://localhost:3000/api/auth/login", { email, password }, "POST" )
    if (res.success) {
      localStorage.setItem("userEmail", res.user.email);
      localStorage.setItem("userName", res.user.name);
      sessionStorage.setItem("token", res.token);

      updateAuthUI();
      closeAuthModal();
      alert("Logged in successfully as: " + res.user.name);
      showPage(window.pageId);
    } else {
      alert("Login failed: " + res.message);
    }
  } catch (err) {
    alert("Error logging in: " + err.message);
  }
}

async function signupUser(event) {
  event.preventDefault();
  const name = document.getElementById("signupName").value;
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;

  try {

    const res = await callApi("http://localhost:3000/api/auth/signup", { name, email, password } , "POST")

    if (res.success) {
      localStorage.setItem("userEmail", res.user.email);
      localStorage.setItem("userName", res.user.name);
      sessionStorage.setItem("token", res.token);

      updateAuthUI();
      closeAuthModal();
      alert("Signed up successfully as: " + res.user.name);
    } else {
      alert("Signup failed: " + res.message);
    }
  } catch (err) {
    alert("Error signing up: " + err.message);
  }
}

function logoutUser() {
  localStorage.removeItem("userEmail");
  localStorage.removeItem("userName");
  sessionStorage.removeItem("token");
  updateAuthUI();
  showPage("home");
  alert("Logged out");
}

async function updateAuthUI() {
  let isLoggedIn = Boolean(sessionStorage.getItem("token"));
  const userName = localStorage.getItem("userName");

  // Nav buttons
  document.getElementById("authBtn").style.display = isLoggedIn ? "none" : "inline-flex";
  document.getElementById("logoutBtn").style.display = isLoggedIn ? "inline-flex" : "none";

  // Homepage buttons
  const homeSignup = document.getElementById("homeSignupBtn");
  const homeSignin = document.getElementById("homeSigninBtn");
  if (homeSignup && homeSignin) {
    homeSignup.style.display = isLoggedIn ? "none" : "inline-block";
    homeSignin.style.display = isLoggedIn ? "none" : "inline-block";
  }

  // Optional greeting
  const greetingEl = document.getElementById("userGreeting");
  if (greetingEl) greetingEl.textContent = isLoggedIn ? `Welcome, ${userName}` : "";
}

// Call on load
updateAuthUI();


