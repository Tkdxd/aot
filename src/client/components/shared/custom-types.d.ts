export type MentionElement = {
  type: 'mention';
  character: string;
  children: CustomText[];
  prefix: string;
  subType: string;
};
