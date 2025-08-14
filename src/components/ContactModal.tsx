import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Phone, Mail, MessageCircle } from 'lucide-react';
import { LoadingButton } from './LoadingStates';
import { useNotifications } from '@/hooks/useNotifications';
import { useAppActions } from '@/contexts/AppContext';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefilledSubject?: string;
}

const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose, prefilledSubject }) => {
  const { success, error } = useNotifications();
  const { registerModal, unregisterModal } = useAppActions();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: prefilledSubject || '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  
  // Unique modal ID
  const modalId = 'contact-modal';

  // Register/unregister modal based on isOpen state
  useEffect(() => {
    if (isOpen) {
      registerModal(modalId);
    } else {
      unregisterModal(modalId);
    }
    
    // Cleanup on unmount
    return () => {
      unregisterModal(modalId);
    };
  }, [isOpen, modalId, registerModal, unregisterModal]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Importación dinámica de EmailJS
      const emailjs = await import('@emailjs/browser');
      
      // Configurar las variables de entorno
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
      
      if (!serviceId || !templateId || !publicKey) {
        throw new Error('Configuración de EmailJS incompleta');
      }

      // Parámetros para el template de EmailJS
      const templateParams = {
        name: formData.name,           // Para {{name}}
        from_email: formData.email,     // Nuevo: email del remitente 
        subject: formData.subject,      // Nuevo: asunto del mensaje
        message: formData.message,      // Para {{message}}
        time: new Date().toLocaleString('es-AR', {
          weekday: 'long',
          year: 'numeric',
          month: 'long', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),                            // Para {{time}}
        to_name: 'Andrés Ruiu'         // Tu nombre
      };

      // Enviar email usando EmailJS
      await emailjs.send(
        serviceId,
        templateId,
        templateParams,
        publicKey
      );
      
      setSubmitStatus('success');
      success(
        `¡Gracias ${formData.name}!`,
        'Tu mensaje se envió correctamente. Te responderé pronto.'
      );
      
      // Resetear formulario después de éxito
      setTimeout(() => {
        setFormData({ name: '', email: '', subject: prefilledSubject || '', message: '' });
        setSubmitStatus('idle');
        onClose();
      }, 2000);
      
    } catch (err) {
      console.error('Error sending email:', err);
      setSubmitStatus('error');
      error(
        'Error al enviar el mensaje',
        'Por favor, inténtalo nuevamente o contáctame directamente.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsApp = () => {
    const message = `Hola Andrés! Me gustaría contactarte para discutir un proyecto.`;
    const whatsappUrl = `https://wa.me/543865351958?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleEmail = () => {
    const subject = "Consulta desde tu portafolio";
    const emailUrl = `mailto:andresruiu@gmail.com?subject=${encodeURIComponent(subject)}`;
    window.location.href = emailUrl;
  };

  const modalVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8,
      y: 50
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8,
      y: 50,
      transition: {
        duration: 0.2
      }
    }
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[10000] flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="bg-card border rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-2xl font-bold">¡Conversemos!</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Quick Contact Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              <motion.button
                onClick={handleWhatsApp}
                className="flex items-center gap-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="p-2 bg-green-500 text-white rounded-full">
                  <Phone className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="font-medium">WhatsApp</div>
                  <div className="text-sm text-muted-foreground">Respuesta rápida</div>
                </div>
              </motion.button>

              <motion.button
                onClick={handleEmail}
                className="flex items-center gap-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="p-2 bg-blue-500 text-white rounded-full">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="font-medium">Email</div>
                  <div className="text-sm text-muted-foreground">Formal</div>
                </div>
              </motion.button>
            </div>

            {/* Separator */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">O envíame un mensaje</span>
              </div>
            </div>

            {/* Contact Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background"
                    placeholder="Tu nombre"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background"
                    placeholder="tu@email.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium mb-2">
                  Asunto *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background"
                  placeholder="¿En qué puedo ayudarte?"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  Mensaje *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background resize-none"
                  placeholder="Cuéntame sobre tu proyecto o idea..."
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <LoadingButton
                  type="submit"
                  isLoading={isSubmitting}
                  className="min-w-[120px]"
                >
                  <Send className="w-4 h-4" />
                  Enviar
                </LoadingButton>
              </div>

              {/* Status Messages */}
              <AnimatePresence>
                {submitStatus === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-4 bg-green-50 border border-green-200 rounded-lg"
                  >
                    <div className="flex items-center gap-2 text-green-800">
                      <MessageCircle className="w-4 h-4" />
                      ¡Mensaje enviado con éxito! Te responderé pronto.
                    </div>
                  </motion.div>
                )}

                {submitStatus === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-4 bg-red-50 border border-red-200 rounded-lg"
                  >
                    <div className="text-red-800">
                      Hubo un error al enviar el mensaje. Por favor, inténtalo de nuevo o contáctame directamente.
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ContactModal;
