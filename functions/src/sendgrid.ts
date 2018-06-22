const functions = require('firebase-functions');

const SENDGRID_API_KEY = functions.config().sendgrid.key;
const orgInviteEn = functions.config().sendgrid.org_invite_en;
const orgInviteHe = functions.config().sendgrid.org_invite_he;
const shakeInviteEn = functions.config().sendgrid.shake_invite_en;
const shakeInviteHe = functions.config().sendgrid.shake_invite_he;
const domainName = functions.config().domain.name;

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(SENDGRID_API_KEY);



export const sendOrgInvite = function(orgId, orgPublicData, inviteEmail, inviteData) {
  const msg = {
    to: inviteEmail,
    from: orgPublicData.orgEmail,
    subject: 'Invite',


    // custom templates
    templateId: '',
    substitutionWrappers: ['{{', '}}'],
    substitutions: {
      userName: inviteData.displayName,
      orgName: orgPublicData.orgName,
      homePageLink: 'http://' + domainName + '/org/' +  orgId,
      inviteLink: 'http://' + domainName + '/org/' +  orgId + '/org-join?name=' + inviteData.displayName + '&mail=' + inviteEmail,
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
};


export const sendShakeInvite = function(orgId, orgPublicData, inviteEmail, inviteData) {
  const msg = {
    to: inviteEmail,
    from: orgPublicData.orgEmail,
    subject: 'Invite',


    // custom templates
    templateId: '',
    substitutionWrappers: ['{{', '}}'],
    substitutions: {
      userName: inviteData.displayName,
      orgName: orgPublicData.orgName,
      homePageLink: 'http://' + domainName + '/org/' +  orgId,
      inviteLink: 'http://' + domainName + '/org/' +  orgId + '/org-join?name=' + inviteData.displayName + '&mail=' + inviteEmail,
    }
  };


  switch(orgPublicData.language) {
    case 'en': {
      msg.templateId = shakeInviteEn;
      break;
    }
    case 'he': {
      msg.templateId = shakeInviteHe;
      msg.subject = 'הזמנה';
      break;
    }
  }

  return sgMail.send(msg)
    .catch(err => console.log(err));
};
