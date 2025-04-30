import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  ChevronRight,
  Mail,
  Phone,
  MapPin,
  Clock,
  ArrowRight,
} from "lucide-react";

// Custom styles based on provided color scheme
const styles = {
  colors: {
    base100: "oklch(97.788% 0.004 56.375)",
    base200: "oklch(93.982% 0.007 61.449)",
    base300: "oklch(91.586% 0.006 53.44)",
    baseContent: "#004751",
    primary: "#004751",
    primaryContent: "oklch(100% 0 0)",
    secondary: "#dde84a",
    secondaryContent: "oklch(100% 0 0)",
    accent: "oklch(90% 0.076 70.697)",
    accentContent: "oklch(47% 0.157 37.304)",
    neutral: "#004751",
    neutralContent: "oklch(100% 0 0)",
    background: "#fcf6e5",
  },
};

export default function BlaBlaMe() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: "ease-out-cubic",
    });
  }, []);

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: styles.colors.background }}
    >
      {/* Hero Section */}
      <section className="relative flex items-center min-h-screen overflow-hidden">
        <div className="container flex flex-col items-center px-4 mx-auto md:px-6 lg:px-8 md:flex-row">
          <div
            data-aos="fade-right"
            className="z-10 w-full pr-0 mb-10 md:w-1/2 md:pr-12 md:mb-0"
          >
            <h1
              className="mb-6 text-4xl font-bold md:text-5xl lg:text-6xl"
              style={{ color: styles.colors.primary }}
            >
              Connect, Speak, <br />
              <span style={{ color: styles.colors.secondary }}>
                Master Languages
              </span>
            </h1>
            <p
              className="mb-8 text-lg md:text-xl"
              style={{ color: styles.colors.baseContent }}
            >
              Join BlaBlaMe to practice languages with certified teachers or
              native speakers. Improve your skills through real conversations.
            </p>
            <button
              className="flex items-center px-6 py-3 text-lg font-medium transition duration-300 ease-in-out transform rounded hover:scale-105"
              style={{
                backgroundColor: styles.colors.secondary,
                color: styles.colors.primary,
              }}
            >
              Let's Start <ChevronRight className="ml-2" size={20} />
            </button>
          </div>

          <div data-aos="fade-left" className="hidden w-full md:w-1/2 md:block">
            <div className="relative w-full">
              <img
                src="/landing.png"
                alt="People speaking different languages"
                className="object-cover w-full h-full rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Timeline Section */}
      <section
        className="px-4 py-20"
        style={{ backgroundColor: styles.colors.base100 }}
      >
        <div className="container mx-auto">
          <h2
            data-aos="fade-up"
            className="mb-16 text-3xl font-bold text-center md:text-4xl"
            style={{ color: styles.colors.primary }}
          >
            How BlaBlaMe Works
          </h2>

          <div className="flex flex-col gap-16">
            {/* Students Timeline */}
            <div>
              <h3
                className="mb-8 text-2xl font-semibold text-center"
                style={{ color: styles.colors.primary }}
              >
                For Students
              </h3>
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute w-1 h-full transform -translate-x-1/2 bg-gray-200 left-1/2"></div>

                {/* Timeline items */}
                <div className="grid grid-cols-1 gap-8">
                  {/* Step 1 */}
                  <div className="flex">
                    <div className="w-1/2 pr-12 text-right">
                      <h4
                        className="mb-2 text-xl font-medium"
                        style={{ color: styles.colors.primary }}
                      >
                        Submit a BlaBla
                      </h4>
                      <p className="text-gray-600">
                        Tell us your language learning goals and preferences.
                      </p>
                    </div>
                    <div className="flex items-center justify-center">
                      <div
                        className="z-10 flex items-center justify-center w-12 h-12 rounded-full shadow-lg"
                        style={{ backgroundColor: styles.colors.secondary }}
                      >
                        <span
                          className="font-bold"
                          style={{ color: styles.colors.primary }}
                        >
                          1
                        </span>
                      </div>
                    </div>
                    <div className="w-1/2"></div>
                  </div>

                  {/* Step 2 */}
                  <div className="flex">
                    <div className="w-1/2"></div>
                    <div className="flex items-center justify-center">
                      <div
                        className="z-10 flex items-center justify-center w-12 h-12 rounded-full shadow-lg"
                        style={{ backgroundColor: styles.colors.secondary }}
                      >
                        <span
                          className="font-bold"
                          style={{ color: styles.colors.primary }}
                        >
                          2
                        </span>
                      </div>
                    </div>
                    <div className="w-1/2 pl-12">
                      <h4
                        className="mb-2 text-xl font-medium"
                        style={{ color: styles.colors.primary }}
                      >
                        Approve an Applicant
                      </h4>
                      <p className="text-gray-600">
                        Choose from qualified teachers who apply to help you.
                      </p>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="flex">
                    <div className="w-1/2 pr-12 text-right">
                      <h4
                        className="mb-2 text-xl font-medium"
                        style={{ color: styles.colors.primary }}
                      >
                        Learn
                      </h4>
                      <p className="text-gray-600">
                        Schedule sessions and practice speaking with guidance.
                      </p>
                    </div>
                    <div className="flex items-center justify-center">
                      <div
                        className="z-10 flex items-center justify-center w-12 h-12 rounded-full shadow-lg"
                        style={{ backgroundColor: styles.colors.secondary }}
                      >
                        <span
                          className="font-bold"
                          style={{ color: styles.colors.primary }}
                        >
                          3
                        </span>
                      </div>
                    </div>
                    <div className="w-1/2"></div>
                  </div>

                  {/* Step 4 */}
                  <div className="flex">
                    <div className="w-1/2"></div>
                    <div className="flex items-center justify-center">
                      <div
                        className="z-10 flex items-center justify-center w-12 h-12 rounded-full shadow-lg"
                        style={{ backgroundColor: styles.colors.secondary }}
                      >
                        <span
                          className="font-bold"
                          style={{ color: styles.colors.primary }}
                        >
                          4
                        </span>
                      </div>
                    </div>
                    <div className="w-1/2 pl-12">
                      <h4
                        className="mb-2 text-xl font-medium"
                        style={{ color: styles.colors.primary }}
                      >
                        Pay
                      </h4>
                      <p className="text-gray-600">
                        Secure payment only after you're satisfied with the
                        session.
                      </p>
                    </div>
                  </div>

                  {/* Step 5 */}
                  <div className="flex">
                    <div className="w-1/2 pr-12 text-right">
                      <h4
                        className="mb-2 text-xl font-medium"
                        style={{ color: styles.colors.primary }}
                      >
                        Enjoy
                      </h4>
                      <p className="text-gray-600">
                        Watch your language skills improve and grow with
                        confidence.
                      </p>
                    </div>
                    <div className="flex items-center justify-center">
                      <div
                        className="z-10 flex items-center justify-center w-12 h-12 rounded-full shadow-lg"
                        style={{ backgroundColor: styles.colors.secondary }}
                      >
                        <span
                          className="font-bold"
                          style={{ color: styles.colors.primary }}
                        >
                          5
                        </span>
                      </div>
                    </div>
                    <div className="w-1/2"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Teachers Timeline */}
            <div>
              <h3
                className="mb-8 text-2xl font-semibold text-center"
                style={{ color: styles.colors.primary }}
              >
                For Teachers
              </h3>
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute w-1 h-full transform -translate-x-1/2 bg-gray-200 left-1/2"></div>

                {/* Timeline items */}
                <div className="grid grid-cols-1 gap-8">
                  {/* Step 1 */}
                  <div className="flex">
                    <div className="w-1/2 pr-12 text-right">
                      <h4
                        className="mb-2 text-xl font-medium"
                        style={{ color: styles.colors.primary }}
                      >
                        Find a BlaBla
                      </h4>
                      <p className="text-gray-600">
                        Browse student requests that match your expertise.
                      </p>
                    </div>
                    <div className="flex items-center justify-center">
                      <div
                        className="z-10 flex items-center justify-center w-12 h-12 rounded-full shadow-lg"
                        style={{ backgroundColor: styles.colors.primary }}
                      >
                        <span
                          className="font-bold"
                          style={{ color: styles.colors.secondaryContent }}
                        >
                          1
                        </span>
                      </div>
                    </div>
                    <div className="w-1/2"></div>
                  </div>

                  {/* Step 2 */}
                  <div className="flex">
                    <div className="w-1/2"></div>
                    <div className="flex items-center justify-center">
                      <div
                        className="z-10 flex items-center justify-center w-12 h-12 rounded-full shadow-lg"
                        style={{ backgroundColor: styles.colors.primary }}
                      >
                        <span
                          className="font-bold"
                          style={{ color: styles.colors.secondaryContent }}
                        >
                          2
                        </span>
                      </div>
                    </div>
                    <div className="w-1/2 pl-12">
                      <h4
                        className="mb-2 text-xl font-medium"
                        style={{ color: styles.colors.primary }}
                      >
                        Apply
                      </h4>
                      <p className="text-gray-600">
                        Send your proposal to students looking for your skills.
                      </p>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="flex">
                    <div className="w-1/2 pr-12 text-right">
                      <h4
                        className="mb-2 text-xl font-medium"
                        style={{ color: styles.colors.primary }}
                      >
                        Teach
                      </h4>
                      <p className="text-gray-600">
                        Conduct engaging language sessions on your schedule.
                      </p>
                    </div>
                    <div className="flex items-center justify-center">
                      <div
                        className="z-10 flex items-center justify-center w-12 h-12 rounded-full shadow-lg"
                        style={{ backgroundColor: styles.colors.primary }}
                      >
                        <span
                          className="font-bold"
                          style={{ color: styles.colors.secondaryContent }}
                        >
                          3
                        </span>
                      </div>
                    </div>
                    <div className="w-1/2"></div>
                  </div>

                  {/* Step 4 */}
                  <div className="flex">
                    <div className="w-1/2"></div>
                    <div className="flex items-center justify-center">
                      <div
                        className="z-10 flex items-center justify-center w-12 h-12 rounded-full shadow-lg"
                        style={{ backgroundColor: styles.colors.primary }}
                      >
                        <span
                          className="font-bold"
                          style={{ color: styles.colors.secondaryContent }}
                        >
                          4
                        </span>
                      </div>
                    </div>
                    <div className="w-1/2 pl-12">
                      <h4
                        className="mb-2 text-xl font-medium"
                        style={{ color: styles.colors.primary }}
                      >
                        Earn
                      </h4>
                      <p className="text-gray-600">
                        Get paid directly after completing your sessions.
                      </p>
                    </div>
                  </div>

                  {/* Step 5 */}
                  <div className="flex">
                    <div className="w-1/2 pr-12 text-right">
                      <h4
                        className="mb-2 text-xl font-medium"
                        style={{ color: styles.colors.primary }}
                      >
                        Enjoy
                      </h4>
                      <p className="text-gray-600">
                        Build your teaching portfolio and connect with students
                        worldwide.
                      </p>
                    </div>
                    <div className="flex items-center justify-center">
                      <div
                        className="z-10 flex items-center justify-center w-12 h-12 rounded-full shadow-lg"
                        style={{ backgroundColor: styles.colors.primary }}
                      >
                        <span
                          className="font-bold"
                          style={{ color: styles.colors.secondaryContent }}
                        >
                          5
                        </span>
                      </div>
                    </div>
                    <div className="w-1/2"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BlaBlas Examples */}
      <section className="px-4 py-20">
        <div className="container mx-auto">
          <h2
            data-aos="fade-up"
            className="mb-16 text-3xl font-bold text-center md:text-4xl"
            style={{ color: styles.colors.primary }}
          >
            Featured BlaBlas
          </h2>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* BlaBla Card 1 */}
            <div
              className="overflow-hidden rounded-lg shadow-lg"
              style={{ backgroundColor: styles.colors.base100 }}
            >
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <img
                    src="https://mighty.tools/mockmind-api/content/human/120.jpg"
                    alt="User"
                    className="object-cover w-12 h-12 rounded-full"
                  />
                  <div className="ml-4">
                    <h4
                      className="font-medium"
                      style={{ color: styles.colors.primary }}
                    >
                      Emma S.
                    </h4>
                    <p className="text-sm text-gray-500">English → Spanish</p>
                  </div>
                </div>
                <h3
                  className="mb-3 text-xl font-medium"
                  style={{ color: styles.colors.primary }}
                >
                  Conversation Practice for Business
                </h3>
                <p className="mb-4 text-gray-600">
                  Looking for twice-weekly practice to improve my Spanish
                  business vocabulary. Preferably with someone experienced in
                  finance terminology.
                </p>
                <div className="flex items-center justify-between">
                  <span
                    className="px-3 py-1 text-sm font-medium rounded"
                    style={{
                      backgroundColor: styles.colors.secondary,
                      color: styles.colors.primary,
                    }}
                  >
                    Intermediate
                  </span>
                  <button
                    className="flex items-center text-sm font-medium"
                    style={{ color: styles.colors.primary }}
                  >
                    View Details <ArrowRight size={16} className="ml-1" />
                  </button>
                </div>
              </div>
            </div>

            {/* BlaBla Card 2 */}
            <div
              className="overflow-hidden rounded-lg shadow-lg"
              style={{ backgroundColor: styles.colors.base100 }}
            >
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <img
                    src="https://mighty.tools/mockmind-api/content/human/129.jpg"
                    alt="User"
                    className="object-cover w-12 h-12 rounded-full"
                  />
                  <div className="ml-4">
                    <h4
                      className="font-medium"
                      style={{ color: styles.colors.primary }}
                    >
                      Miguel T.
                    </h4>
                    <p className="text-sm text-gray-500">Japanese → English</p>
                  </div>
                </div>
                <h3
                  className="mb-3 text-xl font-medium"
                  style={{ color: styles.colors.primary }}
                >
                  Daily Conversation Partner
                </h3>
                <p className="mb-4 text-gray-600">
                  Looking for a patient English speaker for daily 30-minute
                  conversations. I want to improve my pronunciation and fluency.
                </p>
                <div className="flex items-center justify-between">
                  <span
                    className="px-3 py-1 text-sm font-medium rounded"
                    style={{
                      backgroundColor: styles.colors.secondary,
                      color: styles.colors.primary,
                    }}
                  >
                    Beginner
                  </span>
                  <button
                    className="flex items-center text-sm font-medium"
                    style={{ color: styles.colors.primary }}
                  >
                    View Details <ArrowRight size={16} className="ml-1" />
                  </button>
                </div>
              </div>
            </div>

            {/* BlaBla Card 3 */}
            <div
              className="overflow-hidden rounded-lg shadow-lg"
              style={{ backgroundColor: styles.colors.base100 }}
            >
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <img
                    src="https://mighty.tools/mockmind-api/content/human/125.jpg"
                    alt="User"
                    className="object-cover w-12 h-12 rounded-full"
                  />
                  <div className="ml-4">
                    <h4
                      className="font-medium"
                      style={{ color: styles.colors.primary }}
                    >
                      Sarah L.
                    </h4>
                    <p className="text-sm text-gray-500">French → German</p>
                  </div>
                </div>
                <h3
                  className="mb-3 text-xl font-medium"
                  style={{ color: styles.colors.primary }}
                >
                  Exam Preparation
                </h3>
                <p className="mb-4 text-gray-600">
                  Preparing for C1 German exam in 2 months. Need focused
                  practice on speaking and listening comprehension with
                  challenging topics.
                </p>
                <div className="flex items-center justify-between">
                  <span
                    className="px-3 py-1 text-sm font-medium rounded"
                    style={{
                      backgroundColor: styles.colors.secondary,
                      color: styles.colors.primary,
                    }}
                  >
                    Advanced
                  </span>
                  <button
                    className="flex items-center text-sm font-medium"
                    style={{ color: styles.colors.primary }}
                  >
                    View Details <ArrowRight size={16} className="ml-1" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div
            data-aos="fade-up"
            data-aos-delay="400"
            className="mt-12 text-center"
          >
            <button
              className="px-6 py-3 text-lg font-medium transition duration-300 ease-in-out rounded"
              style={{
                backgroundColor: styles.colors.primary,
                color: styles.colors.primaryContent,
              }}
            >
              Explore More BlaBlas
            </button>
          </div>
        </div>
      </section>

      {/* Featured Teachers */}
      <section
        className="px-4 py-20"
        style={{ backgroundColor: styles.colors.base200 }}
      >
        <div className="container mx-auto">
          <h2
            data-aos="fade-up"
            className="mb-16 text-3xl font-bold text-center md:text-4xl"
            style={{ color: styles.colors.primary }}
          >
            Meet Our Teachers
          </h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {/* Teacher Card 1 */}
            <div
              className="overflow-hidden rounded-lg shadow-lg"
              style={{ backgroundColor: styles.colors.base100 }}
            >
              <div className="h-48 overflow-hidden">
                <img
                  src="https://mighty.tools/mockmind-api/content/human/105.jpg"
                  alt="Teacher"
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="p-6">
                <h3
                  className="mb-1 text-xl font-medium"
                  style={{ color: styles.colors.primary }}
                >
                  Professor Maria G.
                </h3>
                <p
                  className="mb-3 text-sm font-medium"
                  style={{ color: styles.colors.secondary }}
                >
                  Spanish, Italian
                </p>
                <p className="mb-4 text-gray-600">
                  Certified language instructor with 10+ years of experience
                  teaching all levels.
                </p>
                <div className="flex items-center">
                  <div className="flex">
                    <svg
                      className="w-4 h-4 text-yellow-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                    <svg
                      className="w-4 h-4 text-yellow-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                    <svg
                      className="w-4 h-4 text-yellow-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                    <svg
                      className="w-4 h-4 text-yellow-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  </div>
                  <span className="ml-2 text-sm text-gray-600">
                    245 sessions
                  </span>
                </div>
              </div>
            </div>

            {/* Teacher Card 2 */}
            <div
              className="overflow-hidden rounded-lg shadow-lg"
              style={{ backgroundColor: styles.colors.base100 }}
            >
              <div className="h-48 overflow-hidden">
                <img
                  src="https://mighty.tools/mockmind-api/content/human/106.jpg"
                  alt="Teacher"
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="p-6">
                <h3
                  className="mb-1 text-xl font-medium"
                  style={{ color: styles.colors.primary }}
                >
                  John K.
                </h3>
                <p
                  className="mb-3 text-sm font-medium"
                  style={{ color: styles.colors.secondary }}
                >
                  English, French
                </p>
                <p className="mb-4 text-gray-600">
                  Conversation specialist focusing on natural fluency and
                  pronunciation.
                </p>
                <div className="flex items-center">
                  <div className="flex">
                    <svg
                      className="w-4 h-4 text-yellow-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                    <svg
                      className="w-4 h-4 text-yellow-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                    <svg
                      className="w-4 h-4 text-yellow-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                    <svg
                      className="w-4 h-4 text-yellow-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  </div>
                  <span className="ml-2 text-sm text-gray-600">
                    178 sessions
                  </span>
                </div>
              </div>
            </div>

            {/* Additional Teacher Cards */}
            {/* Similar structure for 2 more teacher cards */}
          </div>

          <div className="mt-12 text-center">
            <button
              className="px-6 py-3 text-lg font-medium transition duration-300 ease-in-out rounded"
              style={{
                backgroundColor: styles.colors.primary,
                color: styles.colors.primaryContent,
              }}
            >
              View All Teachers
            </button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section data-aos="fade-up" className="px-4 py-20">
        <div className="container mx-auto">
          <h2
            className="mb-16 text-3xl font-bold text-center md:text-4xl"
            style={{ color: styles.colors.primary }}
          >
            Get in Touch
          </h2>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div
              className="p-8 rounded-lg"
              style={{ backgroundColor: styles.colors.base100 }}
            >
              <form>
                <div className="mb-6">
                  <input
                    type="text"
                    placeholder="Your Name"
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2"
                    style={{
                      borderColor: styles.colors.base300,
                      backgroundColor: styles.colors.background,
                      color: styles.colors.baseContent,
                    }}
                  />
                </div>
                <div className="mb-6">
                  <input
                    type="email"
                    placeholder="Your Email"
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2"
                    style={{
                      borderColor: styles.colors.base300,
                      backgroundColor: styles.colors.background,
                      color: styles.colors.baseContent,
                    }}
                  />
                </div>
                <div className="mb-6">
                  <textarea
                    placeholder="Your Message"
                    rows="5"
                    className="w-full px-4 py-3 border rounded-lg resize-none focus:outline-none focus:ring-2"
                    style={{
                      borderColor: styles.colors.base300,
                      backgroundColor: styles.colors.background,
                      color: styles.colors.baseContent,
                    }}
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full px-6 py-3 text-lg font-medium transition duration-300 ease-in-out rounded"
                  style={{
                    backgroundColor: styles.colors.primary,
                    color: styles.colors.primaryContent,
                  }}
                >
                  Send Message
                </button>
              </form>
            </div>

            <div className="flex flex-col justify-center space-y-6">
              <div className="flex items-center">
                <Mail
                  className="w-6 h-6 mr-4"
                  style={{ color: styles.colors.primary }}
                />
                <div>
                  <h3
                    className="text-lg font-medium"
                    style={{ color: styles.colors.primary }}
                  >
                    Email Us
                  </h3>
                  <p className="text-gray-600">contact@blablame.com</p>
                </div>
              </div>
              <div className="flex items-center">
                <Phone
                  className="w-6 h-6 mr-4"
                  style={{ color: styles.colors.primary }}
                />
                <div>
                  <h3
                    className="text-lg font-medium"
                    style={{ color: styles.colors.primary }}
                  >
                    Call Us
                  </h3>
                  <p className="text-gray-600">+1 234 567 890</p>
                </div>
              </div>
              <div className="flex items-center">
                <MapPin
                  className="w-6 h-6 mr-4"
                  style={{ color: styles.colors.primary }}
                />
                <div>
                  <h3
                    className="text-lg font-medium"
                    style={{ color: styles.colors.primary }}
                  >
                    Location
                  </h3>
                  <p className="text-gray-600">
                    123 Language Street, Education City
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <Clock
                  className="w-6 h-6 mr-4"
                  style={{ color: styles.colors.primary }}
                />
                <div>
                  <h3
                    className="text-lg font-medium"
                    style={{ color: styles.colors.primary }}
                  >
                    Hours
                  </h3>
                  <p className="text-gray-600">Monday - Friday: 9am - 6pm</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: styles.colors.primary }}>
        <div className="container px-4 py-12 mx-auto">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            <div>
              <img
                src="/blablame.png"
                alt="BlaBlaMe Logo"
                className="h-8 mb-4"
              />
              <p
                className="text-sm"
                style={{ color: styles.colors.primaryContent }}
              >
                Connecting language learners with expert teachers worldwide.
              </p>
            </div>
            <div>
              <h3
                className="mb-4 text-lg font-semibold"
                style={{ color: styles.colors.primaryContent }}
              >
                Quick Links
              </h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-sm hover:opacity-75"
                    style={{ color: styles.colors.primaryContent }}
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm hover:opacity-75"
                    style={{ color: styles.colors.primaryContent }}
                  >
                    How It Works
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm hover:opacity-75"
                    style={{ color: styles.colors.primaryContent }}
                  >
                    FAQs
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm hover:opacity-75"
                    style={{ color: styles.colors.primaryContent }}
                  >
                    Blog
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3
                className="mb-4 text-lg font-semibold"
                style={{ color: styles.colors.primaryContent }}
              >
                Legal
              </h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-sm hover:opacity-75"
                    style={{ color: styles.colors.primaryContent }}
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm hover:opacity-75"
                    style={{ color: styles.colors.primaryContent }}
                  >
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm hover:opacity-75"
                    style={{ color: styles.colors.primaryContent }}
                  >
                    Cookie Policy
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3
                className="mb-4 text-lg font-semibold"
                style={{ color: styles.colors.primaryContent }}
              >
                Follow Us
              </h3>
              <div className="flex space-x-4">
                {/* Add social media icons/links here */}
              </div>
            </div>
          </div>
          <div
            className="pt-8 mt-8 text-sm text-center border-t"
            style={{
              borderColor: styles.colors.primaryContent,
              color: styles.colors.primaryContent,
            }}
          >
            © 2024 BlaBlaMe. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
