import React from "react";
import Logo from "./Logo";
import { useNavigate } from "react-router-dom";

const NotActive = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-base-200">
      <div className="mb-8">
        <Logo />
      </div>
      <div className="w-96 card bg-base-100 shadow-xl">
        <div className="items-center text-center card-body">
          <div className="mb-4">
            <div className="gap-2 mb-4 badge badge-warning">
              Pending Activation
            </div>
          </div>
          <h2 className="mb-2 card-title text-primary">Account Not Active</h2>
          <p className="text-base-content/70">
            Your account is currently pending activation. Please wait while our
            team reviews your information.
          </p>
          <div className="divider"></div>
          <div className="space-y-2">
            <p className="text-sm text-base-content/70">
              Need help? Contact our support team
            </p>
            <button
              onClick={() => navigate("/")}
              className="w-full btn btn-primary"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotActive;
