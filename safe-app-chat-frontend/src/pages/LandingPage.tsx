import React from "react";
import { Link } from "react-router-dom";
import { Shield, MessageSquare } from "lucide-react";

const LandingPage: React.FC = () => {
  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <div className="container text-center my-auto py-5">
        <div className="mb-4 d-flex justify-content-center align-items-center">
          <MessageSquare className="text-primary" size={40} />
          <h1 className="display-4 fw-bold text-primary ms-2">Chatopia</h1>
        </div>

        <h2 className="h5 mb-4 text-secondary">
          Nền tảng nhắn tin an toàn, bảo vệ bạn khỏi nội dung độc hại ngay lập
          tức
        </h2>

        <div className="d-flex justify-content-center mb-4">
          <Link to="/signin">
            <button className="btn btn-primary me-2 px-4">Đăng Nhập</button>
          </Link>
          <Link to="/register">
            <button className="btn btn-outline-primary px-4">Đăng Ký</button>
          </Link>
        </div>

        <div className="row mt-4 justify-content-center">
          <div className="col-md-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <Shield className="text-primary mx-auto mb-3" size={48} />
                <h3 className="h6 font-weight-bold mb-2">
                  Bảo vệ bạn khỏi tin nhắn độc hại
                </h3>
                <p className="text-muted">
                  Phát hiện nội dung độc hại tiên tiến với sức mạnh AI
                </p>
              </div>
            </div>
          </div>
          {/* Add more feature cards here */}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
