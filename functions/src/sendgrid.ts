const functions = require('firebase-functions');
// const admin = require('firebase-admin');

// admin.initializeApp(functions.config().firebase);
const SENDGRID_API_KEY = functions.config().sendgrid.key;

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(SENDGRID_API_KEY);

const orgInviteEn = 'd51d046f-dd17-411a-8135-a5e810a307e1';
const orgInviteHe = 'a246b010-1bb4-4d22-b23d-244f645e5989';

export const sendOrgInvite = function(orgId, orgPublicData, inviteEmail, inviteData) {
  const msg = {
    to: inviteEmail,
    from: orgPublicData.orgEmail,
    subject: 'Invite',
    // text: `Hey ${toName}. You have a new follower!!! `,
    // html: `<strong>Hey ${toName}. You have a new follower!!!</strong>`,

    // custom templates
    templateId: '',
    substitutionWrappers: ['{{', '}}'],
    substitutions: {
      userName: inviteData.displayName,
      orgName: orgPublicData.orgName,
      inviteLink: 'shake.network/org/' +  orgId + '/invite'
    }
  };


  switch(orgPublicData.language) {
    case 'en': {
      msg.templateId = orgInviteEn;
      break;
    }
    case 'he': {
      msg.templateId = orgInviteHe;
      msg.subject = 'הזמנה';
      break;
    }
  }

  return sgMail.send(msg)
    .catch(err => console.log(err));
}


