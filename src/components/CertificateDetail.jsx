import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft, ExternalLink, Award, Calendar, Building2,
  Layers, Package, Code,
} from "lucide-react";
import Swal from 'sweetalert2';

const SKILL_ICONS = {
  React: Code,
  Python: Code,
  JavaScript: Code,
  default: Package,
};

const SkillBadge = ({ skill }) => {
  const Icon = SKILL_ICONS[skill] || SKILL_ICONS["default"];
  
  return (
    <div className="group relative overflow-hidden px-3 py-2 md:px-4 md:py-2.5 bg-gradient-to-r from-blue-600/10 to-cyan-600/10 rounded-xl border border-blue-500/10 hover:border-blue-500/30 transition-all duration-300 cursor-default">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-cyan-500/0 group-hover:from-blue-500/10 group-hover:to-cyan-500/10 transition-all duration-500" />
      <div className="relative flex items-center gap-1.5 md:gap-2">
        <Icon className="w-3.5 h-3.5 md:w-4 md:h-4 text-blue-400 group-hover:text-blue-300 transition-colors" />
        <span className="text-xs md:text-sm font-medium text-blue-300/90 group-hover:text-blue-200 transition-colors">
          {skill}
        </span>
      </div>
    </div>
  );
};

SkillBadge.propTypes = {
  skill: PropTypes.string.isRequired,
};

const CertificateStats = ({ certificate }) => {
  const skillsCount = certificate?.Skills?.length || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 p-3 md:p-4 bg-[#0a0a1a] rounded-xl overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-cyan-900/20 opacity-50 blur-2xl z-0" />

      {certificate?.Issuer && (
        <div className="relative z-10 flex items-center space-x-2 md:space-x-3 bg-white/5 p-2 md:p-3 rounded-lg border border-blue-500/20 transition-all duration-300 hover:scale-105 hover:border-blue-500/50 hover:shadow-lg">
          <div className="bg-blue-500/20 p-1.5 md:p-2 rounded-full">
            <Building2 className="text-blue-300 w-4 h-4 md:w-6 md:h-6" strokeWidth={1.5} />
          </div>
          <div className="flex-grow">
            <div className="text-sm md:text-base font-semibold text-blue-200">{certificate.Issuer}</div>
            <div className="text-[10px] md:text-xs text-gray-400">Issuing Organization</div>
          </div>
        </div>
      )}

      {certificate?.DateIssued && (
        <div className="relative z-10 flex items-center space-x-2 md:space-x-3 bg-white/5 p-2 md:p-3 rounded-lg border border-cyan-500/20 transition-all duration-300 hover:scale-105 hover:border-cyan-500/50 hover:shadow-lg">
          <div className="bg-cyan-500/20 p-1.5 md:p-2 rounded-full">
            <Calendar className="text-cyan-300 w-4 h-4 md:w-6 md:h-6" strokeWidth={1.5} />
          </div>
          <div className="flex-grow">
            <div className="text-sm md:text-base font-semibold text-cyan-200">{certificate.DateIssued}</div>
            <div className="text-[10px] md:text-xs text-gray-400">Date Issued</div>
          </div>
        </div>
      )}

      {skillsCount > 0 && (
        <div className="relative z-10 flex items-center space-x-2 md:space-x-3 bg-white/5 p-2 md:p-3 rounded-lg border border-purple-500/20 transition-all duration-300 hover:scale-105 hover:border-purple-500/50 hover:shadow-lg">
          <div className="bg-purple-500/20 p-1.5 md:p-2 rounded-full">
            <Layers className="text-purple-300 w-4 h-4 md:w-6 md:h-6" strokeWidth={1.5} />
          </div>
          <div className="flex-grow">
            <div className="text-lg md:text-xl font-semibold text-purple-200">{skillsCount}</div>
            <div className="text-[10px] md:text-xs text-gray-400">Key Skills</div>
          </div>
        </div>
      )}
    </div>
  );
};

CertificateStats.propTypes = {
  certificate: PropTypes.shape({
    Skills: PropTypes.arrayOf(PropTypes.string),
    Issuer: PropTypes.string,
    DateIssued: PropTypes.string,
  }),
};

const CertificateDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCertificateData = () => {
      try {
        const storedCertificates = localStorage.getItem("certificates");
        if (storedCertificates) {
          const allCertificates = JSON.parse(storedCertificates);
          const foundCertificate = allCertificates.find((cert) => cert.id === id);
          
          if (foundCertificate) {
            setCertificate({ id, ...foundCertificate });
          } else {
            // If not found by id, also check without id field
            const indexedCertificates = allCertificates.map((cert, index) => ({
              id: cert.id || index.toString(),
              ...cert,
            }));
            const found = indexedCertificates.find((cert) => cert.id === id);
            if (found) {
              setCertificate(found);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching certificate data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificateData();
  }, [id]);

  const handleCredentialClick = (credentialUrl) => {
    if (!credentialUrl) {
      Swal.fire({
        icon: 'info',
        title: 'Credential Link Not Available',
        text: 'Sorry, the credential verification link is not available for this certificate.',
        confirmButtonText: 'Understood',
        confirmButtonColor: '#3085d6',
        background: '#030014',
        color: '#ffffff'
      });
      return false;
    }
    return true;
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030014] flex items-center justify-center">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full blur-3xl opacity-20 animate-pulse" />
          <div className="relative bg-white/10 rounded-full p-8 backdrop-blur-lg border border-white/20">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-400 border-r-cyan-400"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!certificate) {
    return (
      <div className="min-h-screen bg-[#030014] flex items-center justify-center">
        <div className="text-center space-y-4">
          <Award className="w-16 h-16 mx-auto text-gray-500 opacity-50" />
          <p className="text-xl text-gray-400">Certificate not found</p>
          <button
            onClick={handleBackClick}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030014] py-8 md:py-16 px-4 md:px-[10%]">
      {/* Back Button */}
      <button
        onClick={handleBackClick}
        className="group inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-all duration-300 mb-8 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
        <span className="font-medium">Back</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side - Certificate Image */}
        <div className="lg:col-span-1" data-aos="fade-right" data-aos-duration="1000">
          <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-blue-900/30 to-cyan-900/30 border border-blue-400/20 shadow-2xl sticky top-8">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 z-0" />
            <img
              src={certificate.Img}
              alt={certificate.Title}
              className="w-full h-auto object-contain relative z-10 aspect-square"
            />
            {certificate.CredentialUrl && (
              <a
                href={certificate.CredentialUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleCredentialClick(certificate.CredentialUrl)}
                className="absolute bottom-4 left-4 right-4 px-4 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold transition-all duration-300 flex items-center justify-center gap-2 z-20 group hover:scale-105 active:scale-95"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Verify Credential</span>
              </a>
            )}
          </div>
        </div>

        {/* Right Side - Details */}
        <div className="lg:col-span-2 space-y-8" data-aos="fade-left" data-aos-duration="1000">
          {/* Title */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Award className="w-6 h-6 text-blue-400" />
              <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-blue-200 via-cyan-200 to-purple-200 bg-clip-text text-transparent">
                {certificate.Title}
              </h1>
            </div>
          </div>

          {/* Stats */}
          {certificate && <CertificateStats certificate={certificate} />}

          {/* Issuer and Date Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {certificate.Issuer && (
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-blue-500/30 transition-all duration-300">
                <p className="text-gray-400 text-sm mb-2">Issued By</p>
                <p className="text-white font-semibold">{certificate.Issuer}</p>
              </div>
            )}
            {certificate.DateIssued && (
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-blue-500/30 transition-all duration-300">
                <p className="text-gray-400 text-sm mb-2">Date Issued</p>
                <p className="text-white font-semibold">{certificate.DateIssued}</p>
              </div>
            )}
          </div>

          {certificate.CredentialId && (
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-blue-500/30 transition-all duration-300">
              <p className="text-gray-400 text-sm mb-2">Credential ID</p>
              <p className="text-white font-mono text-sm break-all">{certificate.CredentialId}</p>
            </div>
          )}

          {/* Description */}
          {certificate.Description && (
            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-white">About Certificate</h3>
              <p className="text-gray-300 leading-relaxed">
                {certificate.Description}
              </p>
            </div>
          )}

          {/* Skills */}
          {certificate.Skills && certificate.Skills.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                <Layers className="w-5 h-5" />
                Key Skills Covered
              </h3>
              <div className="flex flex-wrap gap-2">
                {certificate.Skills.map((skill, index) => (
                  <SkillBadge key={index} skill={skill} />
                ))}
              </div>
            </div>
          )}

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            {certificate.CredentialUrl && (
              <a
                href={certificate.CredentialUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleCredentialClick(certificate.CredentialUrl)}
                className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold transition-all duration-300 flex items-center justify-center gap-2 hover:scale-105 active:scale-95"
              >
                <ExternalLink className="w-4 h-4" />
                <span>View Full Credential</span>
              </a>
            )}
            <button
              onClick={handleBackClick}
              className="flex-1 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold transition-all duration-300 flex items-center justify-center gap-2 hover:scale-105 active:scale-95 border border-white/20 hover:border-white/40"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Portfolio</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateDetails;
