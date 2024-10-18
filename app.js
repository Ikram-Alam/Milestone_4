document.getElementById('resume-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const about = document.getElementById('about').value.replace(/,/g, '<br>');
    const education = document.getElementById('education').value.replace(/,/g, '<br>');
    const experience = document.getElementById('experience').value.replace(/,/g, '<br>');
    const skills = document.getElementById('skills').value.replace(/,/g, '<br>');
    const certificates = document.getElementById('certificates').value.replace(/,/g, '<br>');
    const volunteer = document.getElementById('volunteer').value.replace(/,/g, '<br>');

    const profilePic = document.getElementById('profile-pic').files[0];
    let profilePicUrl = '';

    if (profilePic) {
        const reader = new FileReader();
        reader.readAsDataURL(profilePic);
        reader.onload = function (e) {
            profilePicUrl = e.target.result;
            generateResume(profilePicUrl, username);
        };
    } else {
        generateResume();
    }

    function generateResume(profilePicUrl = '', username = '') {
        const resumeContent = `
            <div class="resume-header">
                ${profilePicUrl ? `<img src="${profilePicUrl}" alt="Profile Picture">` : ''}
                <div>
                    <h2>${name}</h2>
                    <p>${email} | ${phone}</p>
                </div>
            </div>
            <div class="resume-section">
                <h3>About</h3>
                <p class="editable-section" data-field="about">${about}</p>
            </div>
            <div class="resume-section">
                <h3>Education</h3>
                <p class="editable-section" data-field="education">${education}</p>
            </div>
            <div class="resume-section">
                <h3>Work Experience</h3>
                <p class="editable-section" data-field="experience">${experience}</p>
            </div>
            <div class="resume-section">
                <h3>Skills</h3>
                <p class="editable-section" data-field="skills">${skills}</p>
            </div>
            <div class="resume-section">
                <h3>Certificates</h3>
                <p class="editable-section" data-field="certificates">${certificates}</p>
            </div>
            <div class="resume-section">
                <h3>Volunteer Experience</h3>
                <p class="editable-section" data-field="volunteer">${volunteer}</p>
            </div>
        `;

        const resumeContainer = document.getElementById('resume-container');
        const resumeContentElement = document.getElementById('resume-content');

        resumeContentElement.innerHTML = resumeContent;
        resumeContainer.style.display = 'block';
        resumeContainer.style.opacity = '1';
        resumeContainer.style.transform = 'translateY(0)';

        // Generate unique URL
        const shareUrl = `${window.location.origin}/resume/${username}`;
        document.getElementById('share-url').value = shareUrl;

        // Add click-to-edit functionality
        document.querySelectorAll('.editable-section').forEach(section => {
            section.addEventListener('click', handleEdit);
        });
    }

    function handleEdit(e) {
        const target = e.target;
        const field = target.getAttribute('data-field');
        const currentValue = target.innerHTML.replace(/<br>/g, ',');  // Convert <br> to commas for editing

        const inputElement = document.createElement('textarea');
        inputElement.classList.add('editable');
        inputElement.value = currentValue;

        target.replaceWith(inputElement);
        inputElement.focus();  // Automatically focus the input element

        inputElement.addEventListener('blur', () => {
            const updatedValue = inputElement.value.replace(/,/g, '<br>');
            const updatedElement = document.createElement('p');
            updatedElement.classList.add('editable-section');
            updatedElement.setAttribute('data-field', field);
            updatedElement.innerHTML = updatedValue;

            inputElement.replaceWith(updatedElement);

            // Re-apply click-to-edit functionality to the new element
            updatedElement.addEventListener('click', handleEdit);
        });
    }

    document.getElementById('download-btn').addEventListener('click', () => {
        const resumeElement = document.getElementById('resume-content');
        html2pdf()
            .from(resumeElement)
            .save(`${document.getElementById('username').value}_resume.pdf`);
    });

    document.getElementById('share-btn').addEventListener('click', () => {
        const shareUrl = document.getElementById('share-url').value;
        navigator.clipboard.writeText(shareUrl)
            .then(() => alert('Resume URL copied to clipboard!'))
            .catch(err => console.error('Error copying URL: ', err));
    });
});
