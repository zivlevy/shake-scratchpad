// const functions = require('firebase-functions');
// const admin = require('firebase-admin');

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey("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");

const orgInviteEn = 'd51d046f-dd17-411a-8135-a5e810a307e1';
const orgInviteHe = 'a246b010-1bb4-4d22-b23d-244f645e5989';

export const sendOrgInvite = function(orgId, orgPublicData, inviteEmail, inviteData) {
  const msg = {
    to: inviteEmail,
    from: 'hello@angularfirebase.com',
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
      break;
    }
  }

  return sgMail.send(msg)
    .catch(err => console.log(err));
}


