import express from 'express';
import { 
  createNote, getNotes, getNote, updateNote, deleteNote,
  searchNotes, generatePublicLink, getPublicNote,
  addCollaborator, getCollaborators, removeCollaborator
} from '../controllers/note.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();
router.get('/public/:shareId', getPublicNote); // Public
router.use(authenticateToken);

router.get('/', getNotes);
router.post('/', createNote);
router.get('/search', searchNotes);
router.route('/:id').get(getNote).put(updateNote).delete(deleteNote);
router.post('/:id/share', generatePublicLink);
router.post('/:id/collaborators', addCollaborator);
router.get('/:id/collaborators', getCollaborators);
router.delete('/:id/collaborators/:userId', removeCollaborator);


export default router;
