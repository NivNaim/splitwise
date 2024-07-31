import { TransformedGroupDto } from 'src/group/dtos/transformed-group.dto';
import { Group } from 'src/group/group.schema';

export const transformGroupToDto = (group: Group): TransformedGroupDto => {
  return {
    id: group.id,
    name: group.name,
    description: group.description,
    ownerId: group.owner.id,
    membersIds: group.members.map((member) => member.id),
  };
};
