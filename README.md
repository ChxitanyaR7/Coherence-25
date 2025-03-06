# Official Documentation for Coherence 25 Website

## Overview

Welcome to the official documentation for Coherence 25, the dynamic and immersive website created for MLSC's 2025 hackathon! Coherence 25 serves as the digital hub for this exciting event, designed to unite brilliant minds, fuel innovation, and showcase the relentless quest for tech brilliance.

## Technologies Used

- React
- Framer Motion for animations
- FontAwesome for social media icons
- Firebase for deployment
- Netlify for CI/CD and realtime preview

## Hackathon Details

- Event Duration: 28th and 29th March 2025
- Venue: Vidyavardhini's College of Engineering & Technology, Vasai

## 📦 Component Structure of Coherence 25 Website:

### 1. React App with Conditional Rendering

The App component in this React application is designed to conditionally render various sections based on the current date. It introduces an animated logo (Introduction component) after a specific reveal date, and until then, displays a placeholder or under-construction page (YetToRevealPage). The remaining components, such as Home, About, Domains, Schedule, GeneralGuidelines, PrizePodium, Sponsors, FAQs, ContactUs, and Footer, are revealed after a short delay following the introduction.

### 2. YetToRevealPage React Component

The YetToRevealPage React component is designed to serve as a placeholder or under-construction page for your website or application. It offers a visually appealing and informative message for users who access a page that is still in the development phase. The component incorporates an engaging image of a construction site, complemented by a friendly message indicating that the user has arrived a bit early.

### 3. Introduction React Component

The Introduction React component provides a visually dynamic and engaging display by combining image rotation and text flickering animations. The component utilizes the Framer Motion library for animation control.

- Rotating Image: The component includes an image (replace imageSrc with the actual path) that rotates continuously in a clockwise direction.
- Text Flickering: The accompanying text "Endless Possibilities Awaits You..." experiences a flickering effect, alternating between different opacity levels to create a captivating visual experience.
- Animation Controls: Framer Motion's useAnimation hook is employed to control the opacity animation of the text.

### 4. Home React Component

The Home React component serves as the landing page for the MLSC Codefest, featuring dynamic elements such as a rotating logo, countdown timer, and social media links. The component incorporates animations using the Framer Motion library to enhance the visual appeal.

- Rotating Logo: The MLSC Codefest logo rotates on the page, adding a dynamic visual element.
- Countdown Timer: A countdown timer displays the time remaining until the specified target date, creating anticipation for the upcoming event.
- Social Media Links: Links to Instagram, LinkedIn, and Discord are provided with corresponding icons, encouraging engagement on various platforms.
- Registration Button: A registration button, initially disabled, can be customized to redirect users to the registration page when enabled.
- Scroll To Top Button: A button appears when the user scrolls down, allowing them to easily navigate back to the top of the page.

### 5. About React Component

The About React component provides information about the Coherence 25 hackathon, combining engaging content with visual elements. The component includes an image, details about the hackathon, and dynamic content such as a rotating tagline. Additionally, it features conditional rendering of buttons based on specified conditions, enabling users to register and access related resources.

- Image Section: Displays an image associated with the hackathon, providing a visual representation of the event.
- Content Section: Describes the purpose of Coherence 25 and invites participants to join the hackathon, fostering creativity and innovation.
- Rotating Tagline: Incorporates a dynamic rotating tagline (RotatingTagline component) for an interactive and engaging element.
- Conditional Buttons: Enables and disables registration and resource buttons based on specified conditions, controlling user access to relevant links.

### 6. Domains React Component

The Domains React component showcases different domains related to the MLSC Codefest, providing information about each domain along with engaging visuals. The component uses the Framer Motion library to introduce an animation, bringing the section onto the screen with a horizontal movement. It features a list of domains, each represented by a title, description, and an associated image. The design emphasizes an interactive experience, with elements scaling on hover.

- Animated Entrance: Utilizes Framer Motion to introduce an animation, smoothly revealing the Domains section with a horizontal movement.
- Domain Information: Presents information about key domains for the MLSC Codefest, including Web Development, App Development, and AI/ML.
- Interactive Design: Enhances user interaction by scaling domain elements on hover, providing a dynamic and engaging user experience.
- Responsive Grid: Utilizes a responsive grid layout to accommodate different screen sizes, ensuring a visually appealing presentation across devices.
- Visual Representation: Each domain is visually represented by an associated image, creating an attractive and informative display.

### 7. Schedule React Component

The Schedule React component displays the schedule for the MLSC Codefest, including events, timings, and descriptions for each day. Framer Motion is used to animate the entrance of the schedule, providing an engaging user experience. The schedule is divided into two days, and each day contains a list of events with specific timings and details.

- Animated Entrance: Utilizes Framer Motion to introduce an animation, smoothly revealing the Schedule section with a horizontal movement.
- Day-wise Schedule: Separates the schedule into two days, providing clarity and organization for the participants.
- Event Information: Displays event details such as timings, titles, and descriptions in a structured format.
- Interactive Design: Incorporates visual elements like lines and circles to enhance the overall visual appeal and guide the user through the schedule.
- Responsive Layout: Utilizes a responsive layout to ensure that the schedule is presented effectively across various screen sizes.

### 8. GeneralGuidelines React Component

The GeneralGuidelines React component provides general guidelines and information for participants of the MLSC Codefest. It includes a list of guidelines presented in a visually appealing format. The guidelines are followed by a button that participants can click to submit their projects. The button is conditionally disabled based on certain criteria, and Framer Motion is used to apply a fade-in animation to the content.

- Animated Entrance: Utilizes Framer Motion to create a fade-in animation for the component, making the content visually engaging.
- General Guidelines List: Presents a list of general guidelines for participants in a formatted and organized manner.
- Dynamic Button: The "Submit Your Project" button is dynamically enabled or disabled based on specified conditions, ensuring participants can only submit within the allowed timeframe.
- Alert on Button Click: Provides an alert when the button is clicked, indicating that participants will be redirected to the submission form.
- Responsive Design: Utilizes responsive design principles to ensure the content is presented effectively across various screen sizes.

### 9. PrizePodium React Component

The PrizePodium React component showcases the prizes up for grabs in the MLSC Codefest. It presents a podium-style display with images for the 1st Runner-up, Winner, and 2nd Runner-up, along with corresponding prize amounts and certificates. Framer Motion is used for a fade-in animation and a scale-up effect when hovering over each podium item.

- Podium Display: Organizes the prize information in a podium-style layout, providing a visually appealing presentation.
- Image Scaling on Hover: Utilizes Framer Motion to scale up images when hovered over, enhancing the interactive experience for users.
- Fade-In Animation: Incorporates a fade-in animation to gradually reveal the content, creating a smooth and engaging entrance effect.
- Responsive Design: Ensures a responsive layout, adapting to various screen sizes for an optimal viewing experience.

### 10. Sponsors React Component

The Sponsors React component is designed to showcase sponsors for the MLSC Codefest. It includes a title, a section with a "Revealing Soon!" message, and commented-out sections for Title Sponsors, Co-Sponsors, and Miscellaneous Sponsors. Framer Motion is used for a fade-in animation.

- Sponsor Sections: Provides commented-out sections for Title Sponsors, Co-Sponsors, and Miscellaneous Sponsors, allowing easy customization for different sponsor categories.
- Fade-In Animation: Incorporates Framer Motion for a smooth fade-in animation effect, creating a visually appealing entrance for the sponsor content.
- Responsive Design: Adopts responsive design principles, ensuring the component adapts well to various screen sizes.

### 11. FAQs React Component

The FAQs React component is designed to display frequently asked questions related to the MLSC Codefest. It features a list of questions with corresponding answers, a hover effect, and a subtle animation for a polished user experience. Framer Motion is used for the animation.

- Interactive Questions: Questions are interactive and can be expanded or collapsed by clicking on them.
- Hover Effect: When a user hovers over a question, the answer is displayed, providing additional information.
- Smooth Animation: Framer Motion is used for a smooth animation to bring the FAQ section into view.

### 12. ContactUs React Component

The ContactUs React component is designed to display contact information and embed a Google Map showing the location of Vidyavardhini's College of Engineering and Technology. It uses Framer Motion for animations and FontAwesome icons for location, phone, and email.

- Contact Information: Displays the college's address, phone numbers for inquiries, and an email address.
- Google Maps Embed: Includes an embedded Google Map to show the location of the college.
- Framer Motion Animation: Utilizes Framer Motion for a fadeInUp animation effect.
- FontAwesome Icons: Incorporates FontAwesome icons for map markers, phones, and envelopes.

## Running the MLSC Codefest Coherence 25 Website Locally

To run the MLSC Codefest Coherence 25 Website locally, follow the guidelines below. Ensure that you have Node.js and npm installed on your machine.

### Prerequisites:

- **Node.js**: Make sure Node.js is installed. You can download it from [here](https://nodejs.org/).

### Steps:

**1. Clone the repository:**

```bash
git clone https://github.com/Microsoft-Learn-Students-Club/Coherence-25
```

**2. Navigate to the project directory:**

```bash
cd Coherence-25
```

**3. Install Dependencies:**

```bash
 npm install
```

**4. Run the application:**

```bash
npm start
```

This command will start the development server and open the app in your default web browser.

**5. Access the App:**

Open your web browser and go to http://localhost:3000. You should see the MLSC Codefest React app running locally.

**6. Explore the App:**

You can now explore the different sections of the MLSC Codefest app, such as General Guidelines, Prize Podium, Sponsors, FAQs, and Contact Us.

**7. Stop the Development Server:**

To stop the development server, press Ctrl + C in the terminal where the server is running.

**Additional Notes:**

- If you encounter any issues with dependencies, ensure that Node.js and npm are properly installed, and try running npm install again.

- Make sure the required npm packages are listed in the package.json file.

- For deployment or production builds, you may need to refer to the specific deployment instructions or build scripts provided in the project.

## Contribution Guidelines

We welcome contributions to enhance the Coherence 1.0 website. Your input is valuable, and following these guidelines ensures a smooth collaboration.

### Getting Started

1. **Fork & Clone:** Begin by forking the repository and cloning it to your local machine.

   ```bash
   git clone https://github.com/your-username/Coherence-25.git
   cd Hackathon_Web
   ```

2. **Environment Setup:** Set up your development environment and install necessary dependencies.

```bash
  npm install
```

3. **Branching:** Create a new branch for your feature or bug fix.

```bash
git checkout -b feature/your-feature-name
```

### Code Style

- Follow consistent coding styles and conventions.
- Ensure meaningful variable and function names.
- Maintain proper indentation.

### Commit Messages

- Write clear and concise commit messages.
- Use present tense and imperative mood (e.g., "Add feature" instead of "Added feature").

### Reporting Issues

If you encounter any issues or bugs, please report them on the [GitHub Issues](https://github.com/your-username/Coherence-25/issues) page. Provide a detailed description, steps to reproduce, and relevant information.

### Testing

Before submitting a pull request, ensure thorough testing of your changes. Verify that the existing functionality remains intact.

### Pull Requests

1. **Create Pull Request:** Develop a pull request against the `main` branch of the original repository.

2. **Description:** Clearly describe the changes and the motivation behind them.

3. **Reference Issues:** If applicable, reference any related issues in your pull request.

### Questions

If you have any questions, feel free to reach out to the maintainers or the community for assistance.

Thank you for contributing! 🌟

## Maintainers

The MLSC Codefest Coherence-25 Website is actively maintained and developed by the following contributors:

1. Yash Chavan -> GitHub: [YashChavanWeb](https://github.com/YashChavanWeb)
2. Krisha Chikka -> GitHub: [krishachikka](https://github.com/krishachikka)

Feel free to contact the maintainers for support, bug reports, or contributions to the project. We appreciate your interest and collaboration!

# Coherence-25
