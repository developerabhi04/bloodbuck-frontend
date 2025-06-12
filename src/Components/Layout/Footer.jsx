import { Call, Facebook, Instagram, Mail, X, YouTube } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { fetchCompanyInfo } from '../../redux/slices/companyDetailsSlices';
import { Link } from 'react-router-dom';
import { logout } from '../../redux/slices/userSlices';

const Footer = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { companys } = useSelector((state) => state.company);

  useEffect(() => {
    dispatch(fetchCompanyInfo());
  }, [dispatch]);

  return (
    <>
      {companys.map((company, index) => (
        <div
          className="bg-[#200d0d] text-[#c6b4b4] w-full py-6 px-4 font-sans"
          key={index}
        >
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 py-8">
            {/* Get in Touch */}
            <div className="space-y-4">
              <img
                src={company.logo[0]?.url}
                className="w-32 h-auto mb-4 object-contain"
                alt="Company Logo"
              />
              <p className="text-sm text-[#898585] leading-relaxed max-w-xs">
                {"We'd"} love to hear from you! For inquiries, collaborations, or support,
                feel free to reach out using the details below.
              </p>
            </div>

            {/* Help Links */}
            <div className="space-y-4">
              <h3 className="text-white uppercase tracking-wider text-sm font-medium">Help</h3>
              <ul className="!list-none p-0 m-0 space-y-3">
                <li>
                  <Link
                    to="/faq"
                    className="text-[#898585] hover:text-white flex items-center gap-2 transition-all hover:translate-y-0.5"
                  >
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link
                    to="/accessibility-statement"
                    className="text-[#898585] hover:text-white flex items-center gap-2 transition-all hover:translate-y-0.5"
                  >
                    Accessibility Statement
                  </Link>
                </li>
                <li>
                  <Link
                    to="/services"
                    className="text-[#898585] hover:text-white flex items-center gap-2 transition-all hover:translate-y-0.5"
                  >
                    Services
                  </Link>
                </li>
                <li>
                  <Link
                    to="/ordering"
                    className="text-[#898585] hover:text-white flex items-center gap-2 transition-all hover:translate-y-0.5"
                  >
                    Ordering
                  </Link>
                </li>
                <li>
                  <Link
                    to="/shipping-policy"
                    className="text-[#898585] hover:text-white flex items-center gap-2 transition-all hover:translate-y-0.5"
                  >
                    Shipping Policy
                  </Link>
                </li>
                <li>
                  <Link
                    to="/privacy-policy"
                    className="text-[#898585] hover:text-white flex items-center gap-2 transition-all hover:translate-y-0.5"
                  >
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>

            {/* My Account */}
            <div className="space-y-4">
              <h3 className="text-white uppercase tracking-wider text-sm font-medium">My Account</h3>
              <ul className="!list-none p-0 m-0 space-y-3">
                {user ? (
                  <>
                    <li>
                      <Link
                        to="/profile"
                        className="text-[#898585] hover:text-white flex items-center gap-2 transition-all hover:translate-y-0.5"
                      >
                        Profile
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/orders"
                        className="text-[#898585] hover:text-white flex items-center gap-2 transition-all hover:translate-y-0.5"
                      >
                        Orders
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={() => dispatch(logout())}
                        className="text-[#898585] hover:text-white flex items-center gap-2 transition-all hover:translate-y-0.5 w-full"
                      >
                        Logout
                      </button>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <Link
                        to="/sign-in"
                        className="text-[#898585] hover:text-white flex items-center gap-2 transition-all hover:translate-y-0.5"
                      >
                        Sign In
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/sign-up"
                        className="text-[#898585] hover:text-white flex items-center gap-2 transition-all hover:translate-y-0.5"
                      >
                        Sign Up
                      </Link>
                    </li>
                  </>
                )}
              </ul>

              <div className="pt-6">
                <h3 className="text-white uppercase tracking-wider text-sm font-medium pb-3">General Inquiries:</h3>
                <ul className="!list-none p-0 m-0 space-y-3">
                  <li className="flex items-center gap-3 text-[#898585]">
                    <Mail className="text-white text-lg" />
                    <span>Email: {company.email}</span>
                  </li>
                  <li className="flex items-center gap-3 text-[#898585]">
                    <Call className="text-white text-lg" />
                    <span>Phone: {company.phone}</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Follow Us */}
            <div className="space-y-4">
              <h3 className="text-white uppercase tracking-wider text-sm font-medium">Follow Us</h3>
              <ul className="!list-none p-0 m-0 space-y-3">
                <li>
                  <a
                    href={company.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#898585] hover:text-[#4267B2] flex items-center gap-3 group transition-all"
                  >
                    <div className="w-8 h-8 bg-[#2c1a1a] rounded-full flex items-center justify-center group-hover:bg-[#4267B2] transition-colors">
                      <Facebook className="group-hover:text-white transition-colors" />
                    </div>
                    <span className="group-hover:text-white transition-colors">Meta</span>
                  </a>
                </li>
                <li>
                  <a
                    href={company.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#898585] hover:text-[#1DA1F2] flex items-center gap-3 group transition-all"
                  >
                    <div className="w-8 h-8 bg-[#2c1a1a] rounded-full flex items-center justify-center group-hover:bg-[#1DA1F2] transition-colors">
                      <X className="group-hover:text-white transition-colors" />
                    </div>
                    <span className="group-hover:text-white transition-colors">Twitter-X</span>
                  </a>
                </li>
                <li>
                  <a
                    href={company.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#898585] hover:text-[#E1306C] flex items-center gap-3 group transition-all"
                  >
                    <div className="w-8 h-8 bg-[#2c1a1a] rounded-full flex items-center justify-center group-hover:bg-[#E1306C] transition-colors">
                      <Instagram className="group-hover:text-white transition-colors" />
                    </div>
                    <span className="group-hover:text-white transition-colors">Instagram</span>
                  </a>
                </li>
                <li>
                  <a
                    href={company.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#898585] hover:text-[#FF0000] flex items-center gap-3 group transition-all"
                  >
                    <div className="w-8 h-8 bg-[#2c1a1a] rounded-full flex items-center justify-center group-hover:bg-[#FF0000] transition-colors">
                      <YouTube className="group-hover:text-white transition-colors" />
                    </div>
                    <span className="group-hover:text-white transition-colors">YouTube</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      ))}

      <footer className="bg-[#221717] py-4 shadow-[0_4px_8px_rgba(0,0,0,0.2)]">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-xs text-[#868383]">
            Copyright © 2025. All Rights Reserved.
          </p>
        </div>
      </footer>
    </>
  );
};

export default Footer;
