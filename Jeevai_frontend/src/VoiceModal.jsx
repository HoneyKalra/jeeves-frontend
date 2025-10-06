import { useApp } from "../context/Appcontext";

export default function VoiceModeModal() {
  const {
    voiceMode,
    setVoiceMode,
    showVoiceModal,
    setShowVoiceModal,
    transcript,
    setTranscript,
  } = useApp();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 ">
      <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 h-56 lg:w-[19%] flex flex-col justify-center items-center text-center relative">
        <div className="animate-pulse flex justify-center items-center">
          <svg
            class="w-16 h-16"
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M16.9337 8.96494C16.426 5.03562 13.0675 2 9 2 4.58172 2 1 5.58172 1 10 1 11.8924 1.65707 13.6313 2.7555 15.0011 3.56351 16.0087 4.00033 17.1252 4.00025 18.3061L4 22H13L13.001 19H15C16.1046 19 17 18.1046 17 17V14.071L18.9593 13.2317C19.3025 13.0847 19.3324 12.7367 19.1842 12.5037L16.9337 8.96494ZM3 10C3 6.68629 5.68629 4 9 4 12.0243 4 14.5665 6.25141 14.9501 9.22118L15.0072 9.66262 16.5497 12.0881 15 12.7519V17H11.0017L11.0007 20H6.00013L6.00025 18.3063C6.00036 16.6672 5.40965 15.114 4.31578 13.7499 3.46818 12.6929 3 11.3849 3 10ZM21.1535 18.1024 19.4893 16.9929C20.4436 15.5642 21 13.8471 21 12.0001 21 10.153 20.4436 8.4359 19.4893 7.00722L21.1535 5.89771C22.32 7.64386 23 9.74254 23 12.0001 23 14.2576 22.32 16.3562 21.1535 18.1024Z"></path>
          </svg>
        </div>
        <p className="text-gray-600 mb-4">
          {transcript || "Speak We Are Listening..."}
        </p>
        <button
          onClick={() => {
            setVoiceMode((prev) => !prev);
            setShowVoiceModal(false);
          }}
          className=" absolute w-12 h-12 text-center bg-gray-600 text-white px-3 rounded-full hover:bg-gray-700  -top-2 -right-2"
        >
          <svg
            class="w-6 h-6"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1024 1024"
            fill="currentColor"
          >
            <path
              fill="currentColor"
              d="M764.288 214.592 512 466.88 259.712 214.592a31.936 31.936 0 0 0-45.12 45.12L466.752 512 214.528 764.224a31.936 31.936 0 1 0 45.12 45.184L512 557.184l252.288 252.288a31.936 31.936 0 0 0 45.12-45.12L557.12 512.064l252.288-252.352a31.936 31.936 0 1 0-45.12-45.184z"
            ></path>
          </svg>
        </button>
      </div>
    </div>
  );
}
