import emailTemplates from '../mockData/emailTemplates.json';
import candidateService from './candidateService';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let templates = [...emailTemplates];

const emailService = {
  async getTemplates() {
    await delay(200);
    return [...templates];
  },

  async getTemplateById(id) {
    await delay(150);
    const template = templates.find(t => t.id === id);
    if (!template) throw new Error('Template not found');
    return { ...template };
  },

  async createTemplate(templateData) {
    await delay(300);
    const newTemplate = {
      ...templateData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    templates.push(newTemplate);
    return { ...newTemplate };
  },

  async updateTemplate(id, templateData) {
    await delay(250);
    const index = templates.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Template not found');
    
    templates[index] = { 
      ...templates[index], 
      ...templateData, 
      updatedAt: new Date().toISOString() 
    };
    return { ...templates[index] };
  },

  async deleteTemplate(id) {
    await delay(200);
    const index = templates.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Template not found');
    
    templates.splice(index, 1);
    return { success: true };
  },

  async sendEmail(emailData) {
    await delay(800); // Simulate network delay
    
    // Simulate occasional failures for realistic testing
    if (Math.random() < 0.1) {
      throw new Error('Email service temporarily unavailable');
    }

    const emailRecord = {
      id: Date.now().toString(),
      candidateId: emailData.candidateId,
      to: emailData.to,
      cc: emailData.cc || '',
      bcc: emailData.bcc || '',
      subject: emailData.subject,
      content: emailData.content,
      attachments: emailData.attachments || [],
      sentAt: new Date().toISOString(),
      status: 'sent',
      templateId: emailData.templateId || null
    };

    // Add email to candidate's activity log
    try {
      const candidate = await candidateService.getById(emailData.candidateId);
      const updatedCandidate = await candidateService.update(emailData.candidateId, {
        ...candidate,
        emails: [...(candidate.emails || []), emailRecord],
        lastActivity: new Date().toISOString()
      });
    } catch (error) {
      console.error('Failed to update candidate email history:', error);
    }

    return { ...emailRecord };
  },

  async getEmailHistory(candidateId) {
    await delay(200);
    try {
      const candidate = await candidateService.getById(candidateId);
      return candidate.emails || [];
    } catch (error) {
      return [];
    }
  },

  async getEmailById(emailId) {
    await delay(150);
    // This would typically query a database
    // For mock purposes, we'll search through all candidates
    try {
      const candidates = await candidateService.getAll();
      for (const candidate of candidates) {
        if (candidate.emails) {
          const email = candidate.emails.find(e => e.id === emailId);
          if (email) return { ...email };
        }
      }
      throw new Error('Email not found');
    } catch (error) {
      throw new Error('Email not found');
    }
  }
};

export default emailService;